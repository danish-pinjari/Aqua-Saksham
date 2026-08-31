import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes';
import { initDatabase } from './database/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Render deployment and local testing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.json({ status: 'AquaSaksham Backend Active', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

// Initialize DB and Start Server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`[AquaSaksham Server] Running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
});