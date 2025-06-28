import { Router } from 'express';
import { openDb } from './db';

const router = Router();

router.get('/prices', (req, res) => {
  const db = openDb();
  const rows = db
    .prepare(
      `SELECT symbol, data, MAX(timestamp) as timestamp FROM prices GROUP BY symbol`
    )
    .all();
  db.close();
  // Build response in CoinGecko format: { symbol: { ...data } }
  const result: Record<string, any> = {};
  for (const row of rows as { symbol: string; data: string }[]) {
    result[row.symbol] = JSON.parse(row.data);
  }
  res.json(result);
});

router.get('/apys', (req, res) => {
  const db = openDb();
  const rows = db
    .prepare(
      `SELECT chain, apy, MAX(timestamp) as timestamp FROM apys GROUP BY chain`
    )
    .all();
  db.close();
  res.json(rows);
});

export default router;
