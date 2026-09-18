/// <reference types="vite/client" />

import { SensorData, AIAnalysisData, AlertItem, NodeItem } from '../types';
import { authService } from './authService';
import { getMockSensorData, initialMockAI, initialMockAlerts, initialMockNodes } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://aqua-saksham-backend.onrender.com/api';

function getAuthHeaders(): HeadersInit {
  const token = authService.getToken();
  const receiver = authService.getCurrentReceiver();
  const activeRxId = receiver?.receiver_id || 'AS-RX-001';

  return {
    'Content-Type': 'application/json',
    'x-receiver-id': activeRxId,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchLatestSensorData(): Promise<SensorData> {
  try {
    const res = await fetch(`${BASE_URL}/sensors/latest`, { 
      headers: getAuthHeaders(),
      cache: 'no-store' // Cache bypass karke fresh real-time readings fetch karega
    });

    if (!res.ok) {
      console.warn(`[API] /sensors/latest endpoint responded with HTTP ${res.status}`);
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    console.log('[API Live Telemetry Data Received]:', data);
    return data;
  } catch (error) {
    console.warn('[API] Backend se live data match nahi hua, fallback mock return ho raha hai:', error);
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
    const res = await fetch(`${BASE_URL}/ai/analysis`, { 
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('[API] AI Analysis fallback loaded:', error);
    return initialMockAI;
  }
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/alerts`, { 
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('[API] Alerts fallback loaded:', error);
    return initialMockAlerts;
  }
}

export async function fetchNodes(): Promise<NodeItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/nodes`, { 
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('[API] Nodes fallback loaded:', error);
    return initialMockNodes;
  }
}