import React, { createContext, useContext, useState } from 'react';
import { ReceiverIdentity } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  receiver: ReceiverIdentity | null;
  login: (receiver: ReceiverIdentity) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [receiver, setReceiver] = useState<ReceiverIdentity | null>(() => {
    return authService.getCurrentReceiver() || {
      receiver_id: 'AS-RX-001',
      node_id: 1,
      username: 'Community Well 01',
      status: 'Online'
    };
  });

  const login = (rec: ReceiverIdentity) => {
    setReceiver(rec);
  };

  const logout = () => {
    authService.logout();
    setReceiver(null);
  };

  return (
    <AuthContext.Provider value={{ receiver, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};