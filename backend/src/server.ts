import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes';
import { initDatabase } from './database/db';

dotenv.config();
initDatabase().catch((error) => {
  console.error('[AquaSaksham Server] Database initialization failed:', error);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'AquaSaksham Core Backend' });
});

app.listen(PORT, () => {
  console.log(`[AquaSaksham Server] Running on http://localhost:${PORT}`);
});