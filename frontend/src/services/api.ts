/// <reference types="vite/client" />

import { SensorData, AIAnalysisData, AlertItem, NodeItem } from '../types';
import { authService } from './authService';

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
  const res = await fetch(`${BASE_URL}/sensors/latest`, { 
    headers: getAuthHeaders(),
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch latest sensor data: HTTP ${res.status}`);
  }

  const data = await res.json();
  console.log('[API Live Telemetry]:', data);
  return data;
}

export async function fetchAIAnalysis(): Promise<AIAnalysisData> {
  const res = await fetch(`${BASE_URL}/ai/analysis`, { 
    headers: getAuthHeaders(),
    cache: 'no-store'
  });

  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  return await res.json();
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const res = await fetch(`${BASE_URL}/alerts`, { 
    headers: getAuthHeaders(),
    cache: 'no-store'
  });

  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  return await res.json();
}

export async function fetchNodes(): Promise<NodeItem[]> {
  const res = await fetch(`${BASE_URL}/nodes`, { 
    headers: getAuthHeaders(),
    cache: 'no-store'
  });

  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  return await res.json();
}