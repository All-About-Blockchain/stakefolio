import express from 'express';
import cors from 'cors';
import { initDb } from './db';
import { startScheduler } from './scheduler';
import routes from './routes';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/', routes);

initDb();
startScheduler();
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
