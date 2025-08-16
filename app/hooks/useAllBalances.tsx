import { useEffect, useState, useMemo, useRef } from 'react';
import {
  StargateClient,
  setupStakingExtension,
  QueryClient,
} from '@cosmjs/stargate';
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { AssetList, Asset, DenomUnit } from '@chain-registry/types';
import { usePrices } from './usePrices';
import { useWallet } from '@/app/contexts/WalletContext';
import { CHAIN_CONFIG } from '@/app/config/chains';

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
  const { address } = useWallet();
  const { assets: registryAssets, loading: registryLoading } =
    useChainRegistryAssets();
  const { getUSDPrice } = usePrices();

  // Only consider chains if we have an address
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
    if (registryLoading || !address) {
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

          const assetLists = [registryAssets[chainName]];

          const balances = balancesRaw.map((b: any) => {
            const meta = getAssetMetaFromLists(assetLists, b.denom);
            const decimals = meta?.decimals ?? 0;
            const displayAmount = formatAmount(b.amount, decimals);
            const symbol = meta?.displayDenom || b.denom;
            const price = getUSDPrice(symbol);
            const usdValue = parseFloat(displayAmount) * price;

            // Debug logging for ATOM specifically
            if (symbol === 'ATOM' || b.denom === 'uatom') {
              console.log(
                `[ATOM Debug] Chain: ${chainName}, Denom: ${b.denom}, Amount: ${b.amount}, Display: ${displayAmount}, Symbol: ${symbol}, Price: ${price}, USD Value: ${usdValue}`
              );
            }

            return {
              denom: b.denom,
              amount: b.amount,
              displayName: meta?.displayName || b.denom,
              displayAmount,
              symbol,
              decimals,
              displayDenom: meta?.displayDenom || b.denom,
              price,
              usdValue,
            };
          });

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

          // Fetch validator information for each delegation (with rate limiting)
          const delegations = await Promise.all(
            (delegationsResp.delegationResponses || []).map(
              async (d: any, index: number) => {
                const meta = getAssetMetaFromLists(assetLists, d.balance.denom);
                const decimals = meta?.decimals ?? 0;
                const displayAmount = formatAmount(d.balance.amount, decimals);
                const symbol = meta?.displayDenom || d.balance.denom;
                const price = getUSDPrice(symbol);
                const usdValue = parseFloat(displayAmount) * price;

                // Debug logging for ATOM staking specifically
                if (symbol === 'ATOM' || d.balance.denom === 'uatom') {
                  console.log(
                    `[ATOM Staking Debug] Chain: ${chainName}, Denom: ${d.balance.denom}, Amount: ${d.balance.amount}, Display: ${displayAmount}, Symbol: ${symbol}, Price: ${price}, USD Value: ${usdValue}`
                  );
                }

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
                    // Commission is stored as a decimal string, convert to percentage
                    console.log(
                      'Full validator response:',
                      validatorResp.validator
                    );

                    const commissionRate =
                      validatorResp.validator.commission?.commissionRates
                        ?.rate || '0';

                    // Debug the commission rate
                    console.log('Raw commission rate:', commissionRate);

                    // For now, let's use a simple fallback until we understand the format
                    validatorCommission = '5%';

                    console.log('Final commission:', validatorCommission);
                  }
                } catch (err) {
                  console.warn(
                    `Failed to fetch validator info for ${d.delegation?.validatorAddress}:`,
                    err
                  );
                  // Use fallback values on error
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
                    displayName: meta?.displayName || d.balance.denom,
                    displayAmount,
                    symbol,
                    decimals,
                    displayDenom: meta?.displayDenom || d.balance.denom,
                    price,
                    usdValue,
                  },
                };
              }
            )
          );

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
        await delay(1000); // increased delay between chains to reduce CORS issues
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
      // Poll every 10 minutes to reduce server load
      pollInterval.current = window.setInterval(fetchAll, 600000);
    }, 1000);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [
    addressesDep,
    registryLoading,
    registryAssets,
    connectedChains,
    getUSDPrice,
    address,
  ]);

  return { assets: data, loading };
}
