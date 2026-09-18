import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';
import { initDatabase } from './database/db';

const app = express();
const PORT = process.env.PORT || 5000;

// Allow all origins to resolve dashboard CORS issues completely
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use('/api', apiRoutes);

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server live on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB Init Error:', err);
  });