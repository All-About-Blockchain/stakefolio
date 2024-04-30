import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.STAKING_REWARDS_API_KEY;

const endpoint = 'https://api.stakingrewards.com/public/query';
const query = `
  {
    assets(where: {symbols: ["ATOM", "INJ", "OSMO", "TIA", "USDC", "NTRN", "AXL", "DYDX", "STRD", "SAGA", "DYM", "JUNO", "KUJI", "XPLA", "FET", "CRO"]}, limit: 100) {
      name
      symbol
      id
      slug
      description
      logoUrl
      metrics(where: {metricKeys: ["reward_rate"]}, limit: 1) {
          defaultValue
      }
    }
  }
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!API_KEY) {
    throw new Error('API key not found in environment variables');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    }),
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  console.log('stakingRewardsData', data);

  res.status(200).json(data);
}
