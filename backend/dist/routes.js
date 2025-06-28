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
// Get historical price data for all symbols (last 24 hours by default)
router.get('/prices/history', (req, res) => {
  const hours = req.query.hours ? parseInt(req.query.hours) : 24;
  const db = (0, db_1.openDb)();
  const rows = db
    .prepare(
      `SELECT symbol, data, timestamp 
       FROM prices 
       WHERE timestamp >= datetime('now', '-${hours} hours')
       ORDER BY symbol, timestamp DESC`
    )
    .all();
  db.close();
  // Group by symbol and create time series
  const result = {};
  for (const row of rows) {
    if (!result[row.symbol]) {
      result[row.symbol] = [];
    }
    result[row.symbol].push({
      ...JSON.parse(row.data),
      timestamp: row.timestamp,
    });
  }
  res.json(result);
});
// Get historical data for a specific symbol
router.get('/prices/symbol/:symbol', (req, res) => {
  const { symbol } = req.params;
  const hours = req.query.hours ? parseInt(req.query.hours) : 24;
  const db = (0, db_1.openDb)();
  const rows = db
    .prepare(
      `SELECT data, timestamp 
       FROM prices 
       WHERE symbol = ? AND timestamp >= datetime('now', '-${hours} hours')
       ORDER BY timestamp DESC`
    )
    .all(symbol);
  db.close();
  const result = rows.map((row) => ({
    ...JSON.parse(row.data),
    timestamp: row.timestamp,
  }));
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
