import { ReceiverIdentity } from '../types';

export interface UserProfile {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  receiver?: ReceiverIdentity;
  user?: UserProfile;
  error?: string;
}

const TOKEN_KEY = 'aquasaksham_jwt_token';
const RECEIVER_KEY = 'aquasaksham_active_receiver';
const USER_KEY = 'aquasaksham_user_profile';

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

  getCurrentUser(): UserProfile | null {
    const data = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    const rx = this.getCurrentReceiver();
    if (rx) {
      return {
        id: rx.receiver_id,
        fullName: rx.username,
        name: rx.username,
        email: `${rx.receiver_id.toLowerCase()}@aquasaksham.com`
      };
    }
    return null;
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

    // Background ping to Render backend
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

  // Supports both signup(dataObject) AND signup(fullName, email, password)
  async signup(firstArg: any, emailArg?: string, _passwordArg?: string): Promise<AuthResponse> {
    let name = 'IoT Operator';
    let email = 'operator@aquasaksham.com';

    if (typeof firstArg === 'object' && firstArg !== null) {
      name = firstArg.fullName || firstArg.name || name;
      email = firstArg.email || email;
    } else if (typeof firstArg === 'string') {
      name = firstArg;
      email = emailArg || email;
    }

    const profile: UserProfile = {
      id: 'AS-RX-001',
      fullName: name,
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    return {
      success: true,
      user: profile,
      receiver: {
        receiver_id: 'AS-RX-001',
        node_id: 1,
        username: name,
        status: 'Online'
      }
    };
  },

  async resetPassword(_email: string): Promise<{ success: boolean; message?: string }> {
    return { success: true, message: 'Password reset instructions sent.' };
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(RECEIVER_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(RECEIVER_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
};

export default authService;