import { Request } from 'express';

export interface SensorReading {
  id?: number;
  receiver_id: string;
  node_id: number;
  ph: number;
  tds: number;
  turbidity: number;
  battery: number;
  risk: number; // 0 = SAFE, 1 = WARNING, 2 = DANGER
  timestamp: string;
}

export interface AlertRecord {
  id?: number;
  receiver_id: string;
  node_id: number;
  type: string;
  severity: 'low' | 'warning' | 'danger';
  message: string;
  timestamp: string;
  status: 'New' | 'Acknowledged' | 'Resolved';
}

export interface SensorNodeRecord {
  id: number;
  name: string;
  status: 'Online' | 'Offline';
  last_seen: string;
  battery: number;
}

export interface SettingsConfig {
  id?: number;
  ph_min: number;
  ph_max: number;
  tds_max: number;
  turbidity_max: number;
}

export interface ReceiverRecord {
  id?: number;
  receiver_id: string;
  node_id: number;
  username: string;
  password_hash: string;
  api_key_hash?: string | null;
  status?: string;
  created_at?: string;
}

export interface AuthJwtPayload {
  receiver_id: string;
  node_id: number;
  username: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthJwtPayload;
}