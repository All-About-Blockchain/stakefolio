import { useEffect, useState } from 'react';

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

    // Poll for price updates every 30 seconds
    const interval = setInterval(fetchPrices, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Helper function to get price for a specific symbol
  const getPrice = (symbol: string): PriceDataPoint | null => {
    const normalizedSymbol = symbol.toLowerCase();
    return prices[normalizedSymbol] || null;
  };

  // Helper function to get USD price for a specific symbol
  const getUSDPrice = (symbol: string): number => {
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

  return {
    prices,
    loading,
    error,
    getPrice,
    getUSDPrice,
  };
}
