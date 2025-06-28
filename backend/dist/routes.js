'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const db_1 = require('./db');
const router = (0, express_1.Router)();
router.get('/prices', (req, res) => {
  const db = (0, db_1.openDb)();
  const rows = db
    .prepare(
      `SELECT symbol, data, MAX(timestamp) as timestamp FROM prices GROUP BY symbol`
    )
    .all();
  db.close();
  // Build response in CoinGecko format: { symbol: { ...data } }
  const result = {};
  for (const row of rows) {
    result[row.symbol] = JSON.parse(row.data);
  }
  res.json(result);
});
router.get('/apys', (req, res) => {
  const db = (0, db_1.openDb)();
  const rows = db
    .prepare(
      `SELECT chain, apy, MAX(timestamp) as timestamp FROM apys GROUP BY chain`
    )
    .all();
  db.close();
  res.json(rows);
});
exports.default = router;
