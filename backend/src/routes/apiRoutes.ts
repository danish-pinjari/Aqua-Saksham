import { Router } from 'express';
import { login } from '../controllers/authController';
import {
  postSensorData,
  getLatestReading,
  getHistory,
  getAlerts,
  getAIAnalysis
} from '../controllers/sensorController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authenticateReceiver } from '../middleware/deviceAuthMiddleware';

const router = Router();

// Public Routes
router.post('/auth/login', login);
router.post('/sensors/data', authenticateReceiver, postSensorData);

// Protected Routes (Token Required)
router.get('/sensors/latest', authenticateToken, getLatestReading);
router.get('/sensors/history', authenticateToken, getHistory);
router.get('/alerts', authenticateToken, getAlerts);
router.get('/ai/analysis', authenticateToken, getAIAnalysis);

export default router;