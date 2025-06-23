import { useEffect, useState, useMemo } from 'react';
import { useChain } from '@interchain-kit/react';
import {
  StargateClient,
  setupStakingExtension,
  QueryClient,
} from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { AssetList, Asset, DenomUnit } from '@chain-registry/types';

// --- useChainRegistryAssets hook ---
const CHAIN_REGISTRY_BASE =
  'https://raw.githubusercontent.com/cosmos/chain-registry/master';
const CHAIN_REGISTRY_CHAINS = ['cosmoshub', 'osmosis', 'juno'];

export function useChainRegistryAssets() {
  const [assets, setAssets] = useState<Record<string, AssetList | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAssets() {
      setLoading(true);
      setError(null);
      const result: Record<string, AssetList | null> = {};
      try {
        await Promise.all(
          CHAIN_REGISTRY_CHAINS.map(async (chain) => {
            try {
              const res = await fetch(
                `${CHAIN_REGISTRY_BASE}/${chain}/assetlist.json`
              );
              if (!res.ok) throw new Error('Failed to fetch ' + chain);
              const json = await res.json();
              result[chain] = json as AssetList;
            } catch (e) {
              result[chain] = null;
            }
          })
        );
        if (!cancelled) setAssets(result);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAssets();
    return () => {
      cancelled = true;
    };
  }, []);

  return { assets, loading, error };
}

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
  }[];
  delegations: {
    validatorAddress: string;
    shares: string;
    balance: {
      denom: string;
      amount: string;
      displayName: string;
      displayAmount: string;
      symbol: string;
      decimals: number;
      displayDenom: string;
    };
  }[];
};

function useAllChains() {
  // Hooks must be called in the same order on every render
  const c1 = useChain('cosmoshub');
  const c2 = useChain('osmosis');
  const c3 = useChain('juno');
  const c4 = useChain('stargaze');
  const c5 = useChain('akash');
  const c6 = useChain('axelar');
  const c7 = useChain('evmos');
  const c8 = useChain('crescent');
  const c9 = useChain('comdex');
  const c10 = useChain('chihuahua');
  const c12 = useChain('stride');
  const c13 = useChain('quicksilver');
  const c14 = useChain('kujira');
  const c15 = useChain('persistence');
  const c16 = useChain('regen');
  const c17 = useChain('bitsong');
  const c18 = useChain('gravitybridge');
  const c19 = useChain('umee');
  const c20 = useChain('desmos');
  return [
    {
      chainName: 'cosmoshub',
      address: c1.address,
      chain: c1.chain,
      assetList: c1.assetList,
    },
    {
      chainName: 'osmosis',
      address: c2.address,
      chain: c2.chain,
      assetList: c2.assetList,
    },
    {
      chainName: 'juno',
      address: c3.address,
      chain: c3.chain,
      assetList: c3.assetList,
    },
    {
      chainName: 'stargaze',
      address: c4.address,
      chain: c4.chain,
      assetList: c4.assetList,
    },
    {
      chainName: 'akash',
      address: c5.address,
      chain: c5.chain,
      assetList: c5.assetList,
    },
    {
      chainName: 'axelar',
      address: c6.address,
      chain: c6.chain,
      assetList: c6.assetList,
    },
    {
      chainName: 'evmos',
      address: c7.address,
      chain: c7.chain,
      assetList: c7.assetList,
    },
    {
      chainName: 'crescent',
      address: c8.address,
      chain: c8.chain,
      assetList: c8.assetList,
    },
    {
      chainName: 'comdex',
      address: c9.address,
      chain: c9.chain,
      assetList: c9.assetList,
    },
    {
      chainName: 'chihuahua',
      address: c10.address,
      chain: c10.chain,
      assetList: c10.assetList,
    },
    {
      chainName: 'stride',
      address: c12.address,
      chain: c12.chain,
      assetList: c12.assetList,
    },
    {
      chainName: 'quicksilver',
      address: c13.address,
      chain: c13.chain,
      assetList: c13.assetList,
    },
    {
      chainName: 'kujira',
      address: c14.address,
      chain: c14.chain,
      assetList: c14.assetList,
    },
    {
      chainName: 'persistence',
      address: c15.address,
      chain: c15.chain,
      assetList: c15.assetList,
    },
    {
      chainName: 'regen',
      address: c16.address,
      chain: c16.chain,
      assetList: c16.assetList,
    },
    {
      chainName: 'bitsong',
      address: c17.address,
      chain: c17.chain,
      assetList: c17.assetList,
    },
    {
      chainName: 'gravitybridge',
      address: c18.address,
      chain: c18.chain,
      assetList: c18.assetList,
    },
    {
      chainName: 'umee',
      address: c19.address,
      chain: c19.chain,
      assetList: c19.assetList,
    },
    {
      chainName: 'desmos',
      address: c20.address,
      chain: c20.chain,
      assetList: c20.assetList,
    },
  ];
}

function getAssetMetaFromLists(
  assetLists: (AssetList | null | undefined)[],
  denom: string
) {
  for (const assetList of assetLists) {
    if (!assetList) continue;
    const asset = assetList.assets.find(
      (a: Asset) =>
        a.base === denom ||
        a.denomUnits?.some?.((u: DenomUnit) => u.denom === denom)
    );
    if (!asset) continue;
    const displayDenom = asset.display;
    const denomUnit = asset.denomUnits?.find(
      (u: DenomUnit) => u.denom === displayDenom
    );
    return {
      displayName: asset.name,
      symbol: displayDenom,
      decimals: denomUnit?.exponent ?? 0,
      displayDenom,
    };
  }
  return undefined;
}

function formatAmount(amount: string, decimals: number) {
  if (!amount) return '0';
  const n = Number(amount) / Math.pow(10, decimals);
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export function useAllBalances() {
  const [data, setData] = useState<ChainBalances[]>([]);
  const [loading, setLoading] = useState(true);
  const chainHooks = useAllChains();
  const { assets: registryAssets, loading: registryLoading } =
    useChainRegistryAssets();

  const addressesDep = useMemo(
    () => chainHooks.map((c) => c.address).join(','),
    [chainHooks]
  );
  const chainIdsDep = useMemo(
    () => chainHooks.map((c) => c.chain?.chainId).join(','),
    [chainHooks]
  );

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (registryLoading) return;
    let cancelled = false;
    let timer: NodeJS.Timeout | null = null;

    async function fetchAll() {
      setLoading(true);
      const results: ChainBalances[] = [];
      for (const { chainName, address, chain, assetList } of chainHooks) {
        if (!address || !chain) {
          results.push({
            chainName,
            address: address || '',
            balances: [],
            delegations: [],
          });
          continue;
        }
        try {
          const rpc = chain.apis?.rpc?.[0]?.address;
          if (!rpc) {
            results.push({
              chainName,
              address,
              balances: [],
              delegations: [],
            });
            continue;
          }
          /* const client = await StargateClient.connect(rpc);
          const balancesRaw = Array.from(await client.getAllBalances(address));

          const assetLists = [registryAssets[chainName], assetList];

          const balances = balancesRaw.map((b) => {
            const meta = getAssetMetaFromLists(assetLists, b.denom);
            const decimals = meta?.decimals ?? 0;
            return {
              denom: b.denom,
              amount: b.amount,
              displayName: meta?.displayName || b.denom,
              displayAmount: formatAmount(b.amount, decimals),
              symbol: meta?.displayDenom || b.denom,
              decimals,
              displayDenom: meta?.displayDenom || b.denom,
            };
          }); */

          const tmClient = await Tendermint34Client.connect(rpc);
          const queryClient = new QueryClient(tmClient);
          const staking = setupStakingExtension(queryClient);
          const delegationsResp =
            await staking.staking.delegatorDelegations(address);
          const delegations = (delegationsResp.delegationResponses || []).map(
            (d) => {
              const meta = getAssetMetaFromLists(assetLists, d.balance.denom);
              const decimals = meta?.decimals ?? 0;
              return {
                validatorAddress: d.delegation?.validatorAddress || '',
                shares: d.delegation?.shares || '',
                balance: {
                  denom: d.balance.denom,
                  amount: d.balance.amount,
                  displayName: meta?.displayName || d.balance.denom,
                  displayAmount: formatAmount(d.balance.amount, decimals),
                  symbol: meta?.displayDenom || d.balance.denom,
                  decimals,
                  displayDenom: meta?.displayDenom || d.balance.denom,
                },
              };
            }
          );

          results.push({
            chainName,
            address,
            balances,
            delegations,
          });
        } catch (err) {
          results.push({
            chainName,
            address,
            balances: [],
            delegations: [],
          });
        }
        await delay(1000);
      }
      if (!cancelled) {
        setData(results);
        setLoading(false);
      }
    }

    // Fetch immediately, then set up interval
    fetchAll();
    timer = setInterval(() => {
      fetchAll();
    }, 15000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [addressesDep, chainIdsDep, registryLoading, registryAssets, chainHooks]);

  return { assets: data, loading };
}
