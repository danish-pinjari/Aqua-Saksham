import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

export type UserProfile = {
  fullName?: string;
  name?: string;
  email?: string;
};

export interface ReceiverIdentity {
  receiver_id: string;
  node_id: number;
  username: string;
  status: string;
}

type UserProfileExtended = UserProfile & {
  email?: string;
  createdAt?: string;
  receiver_id?: string;
  node_id?: number;
  username?: string;
};

interface AuthContextType {
  user: UserProfile | null;
  receiver: ReceiverIdentity | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userOrReceiver: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  receiver: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfileExtended | null>(null);
  const [receiver, setReceiver] = useState<ReceiverIdentity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const existing = authService.getCurrentReceiver();
    if (existing) {
      setReceiver({
        ...existing,
        status: existing.status || 'Online'
      });
      setUser({
        fullName: existing.username || 'Administrator',
        name: existing.username || 'Administrator',
        email: `${existing.receiver_id.toLowerCase()}@aquasaksham.com`,
        receiver_id: existing.receiver_id,
        node_id: existing.node_id,
        username: existing.username
      });
    }
    setIsLoading(false);
  }, []);

  const login = (data: any) => {
    if (data.receiver_id) {
      setReceiver(data);
      setUser({
        fullName: data.username || 'Administrator',
        name: data.username || 'Administrator',
        email: `${data.receiver_id.toLowerCase()}@aquasaksham.com`,
        createdAt: new Date().toISOString(),
        receiver_id: data.receiver_id,
        node_id: data.node_id || 1,
        username: data.username || 'Administrator'
      });
    } else {
      setUser({
        fullName: data.fullName || data.name || 'Administrator',
        name: data.name || data.fullName || 'Administrator',
        email: data.email || 'user@aquasaksham.com',
        createdAt: data.createdAt || new Date().toISOString(),
        receiver_id: data.receiver_id || 'AS-RX-001',
        node_id: data.node_id || 1,
        username: data.fullName || data.name || 'Administrator'
      });
      setReceiver({
        receiver_id: data.receiver_id || 'AS-RX-001',
        node_id: data.node_id || 1,
        username: data.fullName || data.name || 'Community Well 01',
        status: 'Online'
      });
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setReceiver(null);
  };

  return (
    <AuthContext.Provider value={{ user, receiver, isAuthenticated: !!(user || receiver), isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);