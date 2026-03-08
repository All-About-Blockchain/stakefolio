export interface MarketData {
  id: string;
  name: string;
  symbol: string;
  marketCap: number; // in USD
  circulatingSupply: number;
  inflationRate: number; // percentage
  percentLocked: number; // percentage
  stakingApy: number; // percentage
  volume24h: number; // in USD
  iconUrl: string;
}

export const TOTAL_CRYPTO_MARKET_CAP = 2650000000000; // $2.65T

// Base data containing non-price related logic (tokenomics)
export const baseMarketData = [
  {
    id: 'bitcoin',
    name: 'Bitcoin (Babylon)',
    symbol: 'BTC',
    circulatingSupply: 19650000,
    inflationRate: 1.7,
    percentLocked: 0.1, // early stage
    stakingApy: 4.5, // Estimated Babylon APR
    volume24h: 45000000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    circulatingSupply: 120000000,
    inflationRate: -0.1, // slightly deflationary/low
    percentLocked: 26.5,
    stakingApy: 3.2,
    volume24h: 15000000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    circulatingSupply: 443000000,
    inflationRate: 5.2,
    percentLocked: 65.4,
    stakingApy: 7.0,
    volume24h: 3200000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    symbol: 'BNB',
    circulatingSupply: 147500000,
    inflationRate: 1.5,
    percentLocked: 18.2,
    stakingApy: 2.1,
    volume24h: 1800000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    circulatingSupply: 35500000000,
    inflationRate: 3.1,
    percentLocked: 62.8,
    stakingApy: 2.9,
    volume24h: 500000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    circulatingSupply: 377000000,
    inflationRate: 4.8,
    percentLocked: 55.4,
    stakingApy: 7.9,
    volume24h: 600000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    circulatingSupply: 1350000000,
    inflationRate: 10.0,
    percentLocked: 51.2,
    stakingApy: 11.5,
    volume24h: 250000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'POL',
    circulatingSupply: 10000000000,
    inflationRate: 2.0,
    percentLocked: 38.5,
    stakingApy: 4.2,
    volume24h: 400000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  },
  {
    id: 'near',
    name: 'NEAR Protocol',
    symbol: 'NEAR',
    circulatingSupply: 1050000000,
    inflationRate: 5.0,
    percentLocked: 48.3,
    stakingApy: 8.5,
    volume24h: 350000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png',
  },
  {
    id: 'aptos',
    name: 'Aptos',
    symbol: 'APT',
    circulatingSupply: 400000000,
    inflationRate: 7.0,
    percentLocked: 80.5,
    stakingApy: 7.0,
    volume24h: 200000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png',
  },
  {
    id: 'cosmos',
    name: 'Cosmos Hub',
    symbol: 'ATOM',
    circulatingSupply: 390000000,
    inflationRate: 9.8,
    percentLocked: 61.2,
    stakingApy: 13.9,
    volume24h: 150000000,
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png',
  },
];

// Fallback static prices for when pyth is loading/fails
export const fallbackPrices: Record<string, number> = {
  BTC: 68000,
  ETH: 3500,
  SOL: 145,
  BNB: 600,
  ADA: 0.45,
  AVAX: 35,
  DOT: 7.2,
  POL: 0.75,
  NEAR: 6.8,
  APT: 9.2,
  ATOM: 8.5,
};

export const getEnhancedMarketData = (
  livePrices?: Record<string, number>
): MarketData[] => {
  const pricesToUse =
    livePrices && Object.keys(livePrices).length > 0
      ? livePrices
      : fallbackPrices;

  return baseMarketData.map((item) => {
    const price = pricesToUse[item.symbol] || 0;
    const dynamicMarketCap = price * item.circulatingSupply;

    return {
      ...item,
      marketCap:
        dynamicMarketCap > 0
          ? dynamicMarketCap
          : fallbackPrices[item.symbol] * item.circulatingSupply,
    };
  });
};

export const formatCurrency = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

export const formatNumber = (value: number) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toLocaleString();
};
