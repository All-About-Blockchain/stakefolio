import axios from 'axios';

export async function fetchCoinGeckoPrices(
  ids: string[],
  vs_currencies: string[] = ['usd']
) {
  const url = `https://api.coingecko.com/api/v3/simple/price`;
  const { data } = await axios.get(url, {
    params: {
      ids: ids.join(','),
      vs_currencies: vs_currencies.join(','),
      include_market_cap: true,
      include_24hr_vol: true,
      include_24hr_change: true,
      include_last_updated_at: true,
    },
  });
  return data;
}

// Placeholder: Replace with real APY source if available
export async function fetchAPYs(chains: string[]) {
  // Return mock data for now
  return chains.map((chain) => ({ chain, apy: Math.random() * 20 + 1 }));
}
