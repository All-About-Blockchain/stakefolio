import { useEffect, useState, useMemo, useRef } from 'react';
import {
  StargateClient,
  setupStakingExtension,
  QueryClient,
} from '@cosmjs/stargate';
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { usePrices } from './usePrices';
import { useWallet } from '@/app/contexts/WalletContext';
import { CHAIN_CONFIG } from '@/app/config/chains';

export type ChainBalances = {
  chainName: string;
  address: string;
  balances: {
    denom: string;
    amount: string;
    displayName: string;
    displayAmount: string;
    symbol: string;
    decimals: number;
    displayDenom: string;
    price: number;
    usdValue: number;
  }[];
  delegations: {
    validatorAddress: string;
    validatorName: string;
    validatorCommission: string;
    shares: string;
    balance: {
      denom: string;
      amount: string;
      displayName: string;
      displayAmount: string;
      symbol: string;
      decimals: number;
      displayDenom: string;
      price: number;
      usdValue: number;
    };
  }[];
};

// Simplified asset metadata for CosmosHub and Stride
const ASSET_METADATA = {
  uatom: {
    displayName: 'Cosmos',
    symbol: 'ATOM',
    decimals: 6,
    displayDenom: 'ATOM',
  },
  stuatom: {
    displayName: 'Stride Liquid Staked ATOM',
    symbol: 'stATOM',
    decimals: 6,
    displayDenom: 'stATOM',
  },
  stuosmo: {
    displayName: 'Stride Liquid Staked OSMO',
    symbol: 'stOSMO',
    decimals: 6,
    displayDenom: 'stOSMO',
  },
  stujuno: {
    displayName: 'Stride Liquid Staked JUNO',
    symbol: 'stJUNO',
    decimals: 6,
    displayDenom: 'stJUNO',
  },
  stustars: {
    displayName: 'Stride Liquid Staked STARS',
    symbol: 'stSTARS',
    decimals: 6,
    displayDenom: 'stSTARS',
  },
  stuscrt: {
    displayName: 'Stride Liquid Staked SCRT',
    symbol: 'stSCRT',
    decimals: 6,
    displayDenom: 'stSCRT',
  },
};

function getAssetMeta(denom: string) {
  return (
    ASSET_METADATA[denom as keyof typeof ASSET_METADATA] || {
      displayName: denom,
      symbol: denom,
      decimals: 0,
      displayDenom: denom,
    }
  );
}

function formatAmount(amount: string, decimals: number) {
  if (!amount) return '0';
  const n = Number(amount) / Math.pow(10, decimals);
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export function useAllBalances() {
  const [data, setData] = useState<ChainBalances[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useWallet();
  const { getUSDPrice } = usePrices();

  // Only consider CosmosHub and Stride chains
  const connectedChains = useMemo(
    () => (address ? CHAIN_CONFIG : []),
    [address]
  );

  // Debounce: Only fetch after 500ms of no address changes
  const addressesDep = useMemo(() => address || '', [address]);

  const debounceTimeout = useRef<number | null>(null);
  const pollInterval = useRef<number | null>(null);

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (!address) {
      setData([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    function clearTimers() {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      if (pollInterval.current) clearInterval(pollInterval.current);
    }

    async function fetchAll() {
      setLoading(true);
      const results: ChainBalances[] = [];

      for (const { chainName, rpc } of connectedChains) {
        try {
          console.log(
            `[RPC] Connecting to ${rpc} for balances of ${chainName} (${address})`
          );
          const client = await StargateClient.connect(rpc);
          console.log(
            `[RPC] Fetching all balances for ${address} on ${chainName}`
          );
          const balancesRaw = Array.from(await client.getAllBalances(address!));

          const balances = balancesRaw.map((b: any) => {
            const meta = getAssetMeta(b.denom);
            const decimals = meta.decimals;
            const displayAmount = formatAmount(b.amount, decimals);
            const symbol = meta.displayDenom;
            const price = getUSDPrice(symbol);
            const usdValue = parseFloat(displayAmount) * price;

            return {
              denom: b.denom,
              amount: b.amount,
              displayName: meta.displayName,
              displayAmount,
              symbol,
              decimals,
              displayDenom: meta.displayDenom,
              price,
              usdValue,
            };
          });

          // Only fetch delegations for CosmosHub
          let delegations: any[] = [];
          if (chainName === 'cosmoshub') {
            console.log(
              `[RPC] Connecting to ${rpc} for staking delegations of ${chainName} (${address})`
            );
            const tmClient = await Tendermint37Client.connect(rpc);
            const queryClient = new QueryClient(tmClient);
            const staking = setupStakingExtension(queryClient);
            console.log(
              `[RPC] Fetching delegator delegations for ${address} on ${chainName}`
            );
            const delegationsResp = await staking.staking.delegatorDelegations(
              address!
            );

            // Fetch validator information for each delegation
            delegations = await Promise.all(
              (delegationsResp.delegationResponses || []).map(
                async (d: any, index: number) => {
                  const meta = getAssetMeta(d.balance.denom);
                  const decimals = meta.decimals;
                  const displayAmount = formatAmount(
                    d.balance.amount,
                    decimals
                  );
                  const symbol = meta.displayDenom;
                  const price = getUSDPrice(symbol);
                  const usdValue = parseFloat(displayAmount) * price;

                  // Add delay between validator requests to avoid rate limiting
                  if (index > 0) {
                    await delay(200);
                  }

                  // Fetch validator information
                  let validatorName = '';
                  let validatorCommission = '';
                  try {
                    const validatorResp = await staking.staking.validator(
                      d.delegation?.validatorAddress || ''
                    );
                    if (validatorResp.validator) {
                      validatorName =
                        validatorResp.validator.description?.moniker ||
                        validatorResp.validator.operatorAddress ||
                        '';
                      validatorCommission = '5%'; // Simplified for now
                    }
                  } catch (err) {
                    console.warn(
                      `Failed to fetch validator info for ${d.delegation?.validatorAddress}:`,
                      err
                    );
                    validatorName = 'Unknown Validator';
                    validatorCommission = '5%';
                  }

                  return {
                    validatorAddress: d.delegation?.validatorAddress || '',
                    validatorName,
                    validatorCommission,
                    shares: d.delegation?.shares || '',
                    balance: {
                      denom: d.balance.denom,
                      amount: d.balance.amount,
                      displayName: meta.displayName,
                      displayAmount,
                      symbol,
                      decimals,
                      displayDenom: meta.displayDenom,
                      price,
                      usdValue,
                    },
                  };
                }
              )
            );
          }

          results.push({
            chainName,
            address: address!,
            balances,
            delegations,
          });
        } catch (err) {
          console.warn(`Failed to fetch data for ${chainName}:`, err);
          results.push({
            chainName,
            address: address!,
            balances: [],
            delegations: [],
          });
        }
        await delay(1000); // Delay between chains
      }

      if (!cancelled) {
        setData(results);
        setLoading(false);
      }
    }

    // Debounce fetchAll
    clearTimers();
    debounceTimeout.current = window.setTimeout(() => {
      fetchAll();
      // Poll every 10 minutes
      pollInterval.current = window.setInterval(fetchAll, 600000);
    }, 1000);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [addressesDep, connectedChains, getUSDPrice, address]);

  return { assets: data, loading };
}
