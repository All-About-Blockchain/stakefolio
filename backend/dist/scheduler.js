'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.startScheduler = startScheduler;
const node_cron_1 = __importDefault(require('node-cron'));
const fetchers_1 = require('./fetchers');
const db_1 = require('./db');
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
function startScheduler() {
  node_cron_1.default.schedule('*/5 * * * *', async () => {
    try {
      // Fetch and store prices
      const prices = await (0, fetchers_1.fetchCoinGeckoPrices)(
        COINGECKO_IDS,
        CURRENCIES
      );
      const db = (0, db_1.openDb)();
      const priceStmt = db.prepare(
        'INSERT INTO prices (symbol, data) VALUES (?, ?)'
      );
      for (const id of Object.keys(prices)) {
        priceStmt.run(id, JSON.stringify(prices[id]));
      }
      // Fetch and store APYs
      const apys = await (0, fetchers_1.fetchAPYs)(CHAINS);
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
