import { Router } from 'express';
import { login } from '../controllers/authController';
import {
  postSensorData,
  getLatestReading,
  getHistory,
  getAlerts,
  getAIAnalysis,
  getNodes
} from '../controllers/sensorController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authenticateReceiver } from '../middleware/deviceAuthMiddleware';

const router = Router();

// Public & Auth Routes
router.post('/auth/login', login);

// Hardware Ingestion Route (uses device auth middleware)
router.post('/sensors/data', authenticateReceiver, postSensorData);

// Protected Dashboard Routes
router.get('/sensors/latest', authenticateToken, getLatestReading);
router.get('/sensors/history', authenticateToken, getHistory);
router.get('/alerts', authenticateToken, getAlerts);
router.get('/ai/analysis', authenticateToken, getAIAnalysis);
router.get('/nodes', authenticateToken, getNodes);

export default router;