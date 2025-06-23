import { useEffect, useState, useMemo } from 'react';
import { useChain } from '@interchain-kit/react';
import {
  StargateClient,
  setupStakingExtension,
  QueryClient,
} from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

export type ChainBalances = {
  chainName: string;
  address: string;
  balances: { denom: string; amount: string }[];
  delegations: {
    validatorAddress: string;
    shares: string;
    balance: { denom: string; amount: string };
  }[];
};

function useAllChains() {
  // Hooks must be called in the same order on every render
  const c1 = useChain('cosmoshub');
  const c2 = useChain('osmosis');
  const c3 = useChain('juno');
  return [
    { chainName: 'cosmoshub', address: c1.address, chain: c1.chain },
    { chainName: 'osmosis', address: c2.address, chain: c2.chain },
    { chainName: 'juno', address: c3.address, chain: c3.chain },
  ];
}

export function useAllBalances() {
  const [data, setData] = useState<ChainBalances[]>([]);
  const chainHooks = useAllChains();

  const addressesDep = useMemo(
    () => chainHooks.map((c) => c.address).join(','),
    [chainHooks]
  );
  const chainIdsDep = useMemo(
    () => chainHooks.map((c) => c.chain?.chainId).join(','),
    [chainHooks]
  );

  useEffect(() => {
    async function fetchAll() {
      const results: ChainBalances[] = [];
      for (const { chainName, address, chain } of chainHooks) {
        if (!address || !chain) continue;
        try {
          const rpc = chain.apis?.rpc?.[0]?.address;
          if (!rpc) continue;
          const client = await StargateClient.connect(rpc);
          const balances = Array.from(await client.getAllBalances(address));

          // Staking delegations
          const tmClient = await Tendermint34Client.connect(rpc);
          const queryClient = new QueryClient(tmClient);
          const staking = setupStakingExtension(queryClient);
          const delegationsResp =
            await staking.staking.delegatorDelegations(address);
          const delegations = (delegationsResp.delegationResponses || []).map(
            (d) => ({
              validatorAddress: d.delegation?.validatorAddress || '',
              shares: d.delegation?.shares || '',
              balance: d.balance,
            })
          );

          results.push({
            chainName,
            address,
            balances,
            delegations,
          });
        } catch (err) {
          // Optionally handle error per chain
        }
      }
      setData(results);
    }
    fetchAll();
    // Only run when addresses or chainIds or chainHooks change
  }, [addressesDep, chainIdsDep, chainHooks]);

  return data;
}
