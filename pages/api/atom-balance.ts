import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Address parameter is required' });
  }

  try {
    // Validate Cosmos address format
    if (!address.startsWith('cosmos1')) {
      return res.status(400).json({ error: 'Invalid Cosmos address format' });
    }

    // Fetch balance from Keplr LCD API
    const response = await fetch(
      `https://lcd-cosmoshub.keplr.app/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=uatom`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract balance from response
    const balanceAmount = data.balance?.amount || '0';

    // Convert from uatom to ATOM (1 ATOM = 1,000,000 uatom)
    const atomBalance = Number(balanceAmount) / 1_000_000;

    res.status(200).json({
      balance: atomBalance.toFixed(4),
      amount: balanceAmount,
      denom: 'uatom',
    });
  } catch (error) {
    console.error('Error fetching ATOM balance:', error);
    res.status(500).json({
      error: 'Failed to fetch balance',
      balance: '0.0000',
    });
  }
}
