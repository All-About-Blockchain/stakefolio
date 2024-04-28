const axios = require('axios');

export default async function handler(req: any, res: any) {
  const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

  try {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching data from CoinMarketCap API:', error.message);
    res
      .status(500)
      .json({ error: 'Error fetching data from CoinMarketCap API' });
  }
}
