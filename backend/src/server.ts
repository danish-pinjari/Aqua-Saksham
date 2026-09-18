import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';
import { initDatabase } from './database/db';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints Router
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]:', err.stack || err.message);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Initialize Database & Start Server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`AquaSaksham Backend server active on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Database Initialization Failure:', err);
  });