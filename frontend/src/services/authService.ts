import { ReceiverIdentity } from '../types';

export interface UserProfile extends ReceiverIdentity {
  fullName: any;
  name: any;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  receiver?: ReceiverIdentity;
  error?: string;
}

const TOKEN_KEY = 'aquasaksham_jwt_token';
const RECEIVER_KEY = 'aquasaksham_active_receiver';
const BASE_URL = 'http://localhost:5000/api';

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
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: receiverId.trim().toUpperCase(),
          pin: pin.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid Receiver ID or PIN.' };
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, data.token);
      storage.setItem(RECEIVER_KEY, JSON.stringify(data.receiver));

      return { success: true, token: data.token, receiver: data.receiver };
    } catch {
      return { success: false, error: 'Could not connect to backend server.' };
    }
  },

  // Returns currently stored user/receiver (compat for AuthContext)
  getCurrentUser(): UserProfile | null {
    const data = localStorage.getItem(RECEIVER_KEY) || sessionStorage.getItem(RECEIVER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as UserProfile;
    } catch {
      return null;
    }
  },

  // Frontend-side signup stub (returns success). Backend signup not implemented for receivers.
  async signup(fullName: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
    // Minimal client-side validation
    if (!fullName || !email || !password) {
      return { success: false, message: 'All fields are required.' };
    }
    // Simulate async registration
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, message: 'Account created. Please sign in.' };
  },

  // Frontend-side password reset stub
  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 400));
    return { success: true, message: `If an account exists with ${email}, a reset link was sent.` };
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(RECEIVER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(RECEIVER_KEY);
  }
};

export default authService;