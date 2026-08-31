export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  token?: string;
  message?: string;
}

const STORAGE_KEY = 'aquasaksham_auth_session';

export const authService = {
  // Check if session token exists
  getCurrentUser(): UserProfile | null {
    const session = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!session) return null;
    try {
      return JSON.parse(session).user;
    } catch {
      return null;
    }
  },

  // Login handler
  async login(email: string, password: string, rememberMe: boolean): Promise<AuthResponse> {
    // Simulated network latency (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Basic format validation
    if (!email || !password) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    // Default mock check (Accepts standard credentials or valid email format)
    if (password.length < 6) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const mockUser: UserProfile = {
      id: 'usr_01',
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Danish Pinjari',
      email: email,
      role: 'IoT Network Administrator'
    };

    const sessionData = JSON.stringify({ user: mockUser, token: 'jwt_mock_aquasaksham_token_2026' });

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, sessionData);
    } else {
      sessionStorage.setItem(STORAGE_KEY, sessionData);
    }

    return {
      success: true,
      user: mockUser,
      token: 'jwt_mock_aquasaksham_token_2026',
      message: 'Login successful. Redirecting...'
    };
  },

  // Registration handler
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required.' };
    }

    return {
      success: true,
      message: 'Account created successfully! Please sign in.'
    };
  },

  // Password reset request
  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // For security, always return generic message
    return {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    };
  },

  // Logout handler
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }
};