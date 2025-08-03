import { useEffect, useState, useMemo } from 'react';

export interface PriceDataPoint {
  usd: number;
  cad: number;
  eur: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
  last_updated_at: number;
  timestamp: string;
}

export interface PriceData {
  [symbol: string]: PriceDataPoint;
}

// Mapping from display symbols to CoinGecko IDs
const SYMBOL_TO_COINGECKO: Record<string, string> = {
  ATOM: 'cosmos',
  OSMO: 'osmosis',
  JUNO: 'juno-network',
  INJ: 'injective-protocol',
  TIA: 'celestia',
  STARS: 'stargaze',
  AKT: 'akash-network',
  AXL: 'axelar',
  EVMOS: 'evmos',
  CRE: 'crescent-network',
  CMDX: 'comdex',
  HUAHUA: 'chihuahua-token',
  STRD: 'stride',
  QCK: 'quicksilver',
  KUJI: 'kujira',
  XPRT: 'persistence',
  REGEN: 'regen',
  BTSG: 'bitsong',
  GRAV: 'graviton',
  UMEE: 'umee',
  DSM: 'desmos',
};

export function usePrices() {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:4000/prices');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setPrices(data);
          setLastFetch(Date.now());
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching prices:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    };

    fetchPrices();

    // Poll for price updates every 5 minutes instead of 30 seconds
    const interval = setInterval(fetchPrices, 300000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Memoize helper functions to prevent unnecessary re-renders
  const getPrice = useMemo(() => {
    return (symbol: string): PriceDataPoint | null => {
      const normalizedSymbol = symbol.toLowerCase();
      return prices[normalizedSymbol] || null;
    };
  }, [prices]);

  const getUSDPrice = useMemo(() => {
    return (symbol: string): number => {
      // First try the symbol as-is (for CoinGecko IDs)
      let price = getPrice(symbol);
      if (price) return price.usd;

      // If not found, try to map display symbol to CoinGecko ID
      const coingeckoId = SYMBOL_TO_COINGECKO[symbol.toUpperCase()];
      if (coingeckoId) {
        price = getPrice(coingeckoId);
        if (price) return price.usd;
      }

      // If still not found, try lowercase version
      price = getPrice(symbol.toLowerCase());
      if (price) return price.usd;

      return 0;
    };
  }, [getPrice]);

  return {
    prices,
    loading,
    error,
    lastFetch,
    getPrice,
    getUSDPrice,
  };
}
