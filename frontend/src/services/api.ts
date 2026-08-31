import { SensorData, AIAnalysisData, AlertItem, NodeItem } from '../types';
import { authService } from './authService';
import { initialMockNodes } from './mockData';

const BASE_URL = 'http://localhost:5000/api';

function getAuthHeaders(): HeadersInit {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchLatestSensorData(): Promise<SensorData> {
  const res = await fetch(`${BASE_URL}/sensors/latest`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function fetchAIAnalysis(): Promise<AIAnalysisData> {
  const res = await fetch(`${BASE_URL}/ai/analysis`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const res = await fetch(`${BASE_URL}/alerts`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function fetchNodes(): Promise<NodeItem[]> {
  // Backend endpoint not implemented; return local mock nodes
  return Promise.resolve(initialMockNodes);
}