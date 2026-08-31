export interface SensorData {
  nodeId: number;
  ph: number;
  tds: number;
  turbidity: number;
  battery: number;
  risk: number;
  timestamp: string;
}

export interface AIAnalysisData {
  status: string;
  confidence: string;
  lastAnalysis: string;
  risk: 'SAFE' | 'WARNING' | 'DANGER';
  diseaseRisk: string;
  recommendation: string;
  solution: string;
  type: string;
}

export interface AlertItem {
  id: number;
  node_id: number;
  type: string;
  severity: 'low' | 'warning' | 'danger';
  message: string;
  timestamp: string;
  status: string;
}

export interface NodeItem {
  id: number;
  name: string;
  status: 'Online' | 'Offline';
  last_seen: string;
  battery: number;
}

export interface ReceiverIdentity {
  receiver_id: string;
  node_id: number;
  username: string;
  status?: string;
}