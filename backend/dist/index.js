'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));
const db_1 = require('./db');
const scheduler_1 = require('./scheduler');
const routes_1 = __importDefault(require('./routes'));
const app = (0, express_1.default)();
const PORT = 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/', routes_1.default);
(0, db_1.initDb)();
(0, scheduler_1.startScheduler)();
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
