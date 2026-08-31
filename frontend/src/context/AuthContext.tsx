import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserProfile } from '../services/authService';

export interface ReceiverIdentity {
  receiver_id: string;
  node_id: number;
  username: string;
  status: string;
}

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [receiver, setReceiver] = useState<ReceiverIdentity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) {
      setUser(existing);
      setReceiver({
        receiver_id: (existing as any).receiver_id || 'AS-RX-001',
        node_id: (existing as any).node_id || 1,
        username: existing.name || 'Community Well 01',
        status: 'Online'
      });
    }
    setIsLoading(false);
  }, []);

  const login = (data: any) => {
    if (data.receiver_id) {
      setReceiver(data);
      setUser({
        id: data.receiver_id,
        name: data.username,
        email: `${data.receiver_id.toLowerCase()}@aquasaksham.com`,
        role: 'IoT Administrator'
      });
    } else {
      setUser(data);
      setReceiver({
        receiver_id: data.receiver_id || 'AS-RX-001',
        node_id: data.node_id || 1,
        username: data.name,
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