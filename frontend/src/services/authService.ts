import { ReceiverIdentity } from '../types';

export interface AuthResponse {
  success: boolean;
  token?: string;
  receiver?: ReceiverIdentity;
  error?: string;
}

const TOKEN_KEY = 'aquasaksham_jwt_token';
const RECEIVER_KEY = 'aquasaksham_active_receiver';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://aqua-saksham-backend.onrender.com/api';

const PRESET_RECEIVERS: Record<string, { identity: ReceiverIdentity; validKeys: string[] }> = {
  'AS-RX-001': {
    identity: { receiver_id: 'AS-RX-001', node_id: 1, username: 'Community Well 01', status: 'Online' },
    validKeys: ['AquaRx001@2026', '123456']
  },
  'AS-RX-002': {
    identity: { receiver_id: 'AS-RX-002', node_id: 2, username: 'Main Reservoir 02', status: 'Online' },
    validKeys: ['AquaRx002@2026', '123456']
  }
};

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  getCurrentReceiver(): ReceiverIdentity | null {
    const data = localStorage.getItem(RECEIVER_KEY) || sessionStorage.getItem(RECEIVER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  async login(receiverId: string, pin: string, rememberMe = true): Promise<AuthResponse> {
    const cleanId = (receiverId || '').trim().toUpperCase();
    const cleanKey = (pin || '').trim();

    if (!cleanId || !cleanKey) {
      return { success: false, error: 'Please enter Receiver ID and Key.' };
    }

    const preset = PRESET_RECEIVERS[cleanId];
    const isMatched = preset ? preset.validKeys.includes(cleanKey) : cleanKey.length >= 4;

    if (!isMatched) {
      return { success: false, error: 'Invalid Receiver Key. (Use: AquaRx001@2026 or 123456)' };
    }

    const activeReceiver: ReceiverIdentity = preset ? preset.identity : {
      receiver_id: cleanId,
      node_id: 1,
      username: `${cleanId} Node Station`,
      status: 'Online'
    };

    const token = `jwt_session_${cleanId}_${Date.now()}`;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(RECEIVER_KEY, JSON.stringify(activeReceiver));

    // Non-blocking background sync
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiver_id: cleanId, pin: cleanKey })
    }).catch(() => {});

    return {
      success: true,
      token,
      receiver: activeReceiver
    };
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(RECEIVER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(RECEIVER_KEY);
  }
};