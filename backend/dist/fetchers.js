'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.fetchCoinGeckoPrices = fetchCoinGeckoPrices;
exports.fetchAPYs = fetchAPYs;
const axios_1 = __importDefault(require('axios'));
async function fetchCoinGeckoPrices(ids, vs_currencies = ['usd']) {
  const url = `https://api.coingecko.com/api/v3/simple/price`;
  const { data } = await axios_1.default.get(url, {
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
async function fetchAPYs(chains) {
  // Return mock data for now
  return chains.map((chain) => ({ chain, apy: Math.random() * 20 + 1 }));
}
