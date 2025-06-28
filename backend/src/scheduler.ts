import cron from 'node-cron';
import { fetchCoinGeckoPrices, fetchAPYs } from './fetchers';
import { openDb } from './db';

const COINGECKO_IDS = [
  'cosmos', // ATOM
  'osmosis', // OSMO
  'juno-network', // JUNO
  'injective-protocol', // INJ
  'celestia', // TIA
  'stargaze', // STARS
  'akash-network', // AKT
  'axelar', // AXL
  'evmos', // EVMOS
  'crescent-network', // CRE
  'comdex', // CMDX
  'chihuahua-token', // HUAHUA
  'stride', // STRD
  'quicksilver', // QCK
  'kujira', // KUJI
  'persistence', // XPRT
  'regen', // REGEN
  'bitsong', // BTSG
  'graviton', // GRAV
  'umee', // UMEE
  'desmos', // DSM
];
const CHAINS = ['cosmos', 'osmosis', 'juno']; // Add all relevant chain names
const CURRENCIES = ['usd', 'cad', 'eur'];

export function startScheduler() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      // Fetch and store prices
      const prices = await fetchCoinGeckoPrices(COINGECKO_IDS, CURRENCIES);
      const db = openDb();
      const priceStmt = db.prepare(
        'INSERT INTO prices (symbol, data) VALUES (?, ?)'
      );
      for (const id of Object.keys(prices)) {
        priceStmt.run(id, JSON.stringify(prices[id]));
      }
      // Fetch and store APYs
      const apys = await fetchAPYs(CHAINS);
      const apyStmt = db.prepare('INSERT INTO apys (chain, apy) VALUES (?, ?)');
      for (const { chain, apy } of apys) {
        apyStmt.run(chain, apy);
      }
      db.close();
      console.log('Updated prices and APYs');
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  });
}
