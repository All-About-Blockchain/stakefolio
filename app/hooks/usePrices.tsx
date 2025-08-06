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

        // Try to fetch from local price service, but don't fail if unavailable
        try {
          const response = await fetch('http://localhost:4000/prices');
          if (response.ok) {
            const data = await response.json();
            if (!cancelled) {
              setPrices(data);
              setLastFetch(Date.now());
              setLoading(false);
            }
            return;
          }
        } catch (localErr) {
          console.log('Local price service unavailable, using fallback prices');
        }

        // If local service fails, use empty prices (fallback prices will be used)
        if (!cancelled) {
          setPrices({});
          setLastFetch(Date.now());
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error in price fetching:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    };

    fetchPrices();

    // Poll for price updates every 15 minutes to reduce server load
    const interval = setInterval(fetchPrices, 900000);

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

      // Fallback prices for common tokens when price service is unavailable
      const fallbackPrices: Record<string, number> = {
        ATOM: 4.23,
        OSMO: 0.16,
        JUNO: 0.08,
        STARS: 0.001,
        AKT: 1.18,
        AXL: 0.85,
        EVMOS: 0.002,
        CRE: 0.12,
        CMDX: 0.05,
        HUAHUA: 0.000012,
        STRD: 0.14,
        QCK: 0.08,
        KUJI: 0.25,
        XPRT: 0.046,
        REGEN: 0.014,
        BTSG: 0.008,
        GRAV: 0.12,
        UMEE: 0.008,
        DSM: 0.015,
      };

      const fallbackPrice = fallbackPrices[symbol.toUpperCase()];
      if (fallbackPrice) {
        console.log(`Using fallback price for ${symbol}: $${fallbackPrice}`);
        return fallbackPrice;
      }

      console.log(`No price found for ${symbol}, using 0`);
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
