import { useState, useEffect } from 'react';
import { PriceServiceConnection } from '@pythnetwork/price-service-client';
import { fallbackPrices } from '../services/mockMarketData';

// Pyth Price Feed IDs for the assets used in our dashboard
export const PYTH_FEED_IDS = {
  BTC: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  SOL: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  BNB: '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101d4f',
  ADA: '0x2a01deaec9e51a579277b34b122399984d0bbf57e24afd8d166ac0a89f92dc17',
  AVAX: '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb2e12e8d350b5df9',
  DOT: '0x17c0df61416eb74a8ac1fceeeb0cf1fec5bd86b1fca82d33bdfc54da1ba67253',
  POL: '0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471ba672f78601ce83',
  NEAR: '0xc4caed718227b409748cfba6b78cabd9c5857eacfeaaede80695027599723ecb',
  APT: '0x03ae4db222d48baebc5f77d341b52eec6d216f404caec5a9d9e4a3c10a30b4d4',
  ATOM: '0xb00b60f88b03a6a625a8d1c048c3f66653df21341a961ae011f004afbdccaddp', // ATOM Feed ID fallback
};

export const useLivePrices = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let connection: PriceServiceConnection;

    const fetchPrices = async () => {
      try {
        connection = new PriceServiceConnection('https://hermes.pyth.network');
        const priceIds = Object.values(PYTH_FEED_IDS);

        const latestPrices = await connection.getLatestPriceFeeds(priceIds);

        if (latestPrices) {
          const newPrices: Record<string, number> = {};

          Object.entries(PYTH_FEED_IDS).forEach(([symbol, id]) => {
            const feed = latestPrices.find((p) => p.id === id);
            if (feed) {
              const price = feed.getPriceUnchecked();
              // Parse price correctly using expo
              newPrices[symbol] =
                parseFloat(price.price) * Math.pow(10, price.expo);
            }
          });

          // Add dummy price for ATOM if not found in Pyth stable feeds
          if (!newPrices['ATOM']) {
            newPrices['ATOM'] = 11.53;
          }

          setPrices(newPrices);
          setLoading(false);
        } else {
          console.warn('No price data returned from Pyth, using fallback prices');
          setPrices(fallbackPrices);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Error fetching live prices, falling back to static data.');
        setPrices(fallbackPrices);
        setLoading(false);
      }
    };

    fetchPrices();

    // In a real app we'd subscribe or poll, but for this demo fetching once or every 30s is fine to prevent quota limits
    const interval = setInterval(fetchPrices, 30000);

    return () => {
      clearInterval(interval);
      if (connection) {
        connection.closeWebSocket();
      }
    };
  }, []);

  return { prices, loading };
};
