import { SensorData, AIAnalysisData, AlertItem, NodeItem } from '../types';

let mockPh = 7.50;
let mockTds = 370;
let mockTurbidity = 3.5;
let mockBattery = 98;

export function getMockSensorData(): SensorData {
  mockPh = Number((mockPh + (Math.random() * 0.1 - 0.05)).toFixed(2));
  mockTds = Math.round(mockTds + (Math.random() * 4 - 2));
  mockTurbidity = Number((mockTurbidity + (Math.random() * 0.2 - 0.1)).toFixed(1));

  return {
    nodeId: 1,
    ph: mockPh,
    tds: mockTds,
    turbidity: mockTurbidity,
    battery: mockBattery,
    risk: mockPh < 6.5 || mockPh > 8.5 || mockTds > 500 || mockTurbidity > 5 ? 1 : 0,
    timestamp: new Date().toISOString()
  };
}

export function getMockHistoryData(count = 12) {
  const data = [];
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const time = new Date(now - i * 2 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    data.push({
      time: time,
      ph: Number((7.1 + Math.sin(i) * 0.4).toFixed(2)),
      tds: Math.round(340 + Math.cos(i) * 30),
      turbidity: Number((3.2 + Math.sin(i * 0.5) * 0.8).toFixed(1))
    });
  }
  return data;
}

export const initialMockAI: AIAnalysisData = {
  status: 'Active',
  confidence: '92%',
  lastAnalysis: new Date().toLocaleDateString('en-GB'),
  risk: 'SAFE',
  diseaseRisk: '15%',
  recommendation: 'Water quality is stable. No action required.',
  solution: 'Source parameters are optimal. No secondary treatment currently warranted.',
  type: 'Prototype AI Risk Estimation'
};

export const initialMockAlerts: AlertItem[] = [
  { id: 1, node_id: 1, type: 'Calibration Warning', severity: 'warning', message: 'TDS variance +/- 5% detected during line test', timestamp: '2026-08-18 17:30', status: 'New' },
  { id: 2, node_id: 1, type: 'LoRa Packet Check', severity: 'low', message: 'Sub-gigahertz RSSI stable at -78dBm', timestamp: '2026-08-18 16:15', status: 'Acknowledged' }
];

export const initialMockNodes: NodeItem[] = [
  { id: 1, name: 'Node 01 (Community Well 1)', status: 'Online', last_seen: '10 seconds ago', battery: 98 },
  { id: 2, name: 'Node 02 (Primary Reservoir)', status: 'Offline', last_seen: '2 hours ago', battery: 84 }
];