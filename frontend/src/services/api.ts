/// <reference types="vite/client" />

import { SensorData, AIAnalysisData, AlertItem, NodeItem } from '../types';
import { authService } from './authService';
import { getMockSensorData, initialMockAI, initialMockAlerts, initialMockNodes } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://aqua-saksham-backend.onrender.com/api';

function getAuthHeaders(): HeadersInit {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchLatestSensorData(): Promise<SensorData> {
  try {
    const res = await fetch(`${BASE_URL}/sensors/latest`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  } catch {
    const receiver = authService.getCurrentReceiver();
    const mock = getMockSensorData();
    return {
      ...mock,
      nodeId: receiver?.node_id || 1
    };
  }
}

export async function fetchAIAnalysis(): Promise<AIAnalysisData> {
  try {
    const res = await fetch(`${BASE_URL}/ai/analysis`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  } catch {
    return initialMockAI;
  }
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/alerts`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  } catch {
    return initialMockAlerts;
  }
}

export async function fetchNodes(): Promise<NodeItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/nodes`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  } catch {
    return initialMockNodes;
  }
}