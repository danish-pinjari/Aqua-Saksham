import React, { useState } from 'react';
import { Radio, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC<{ onNavigate: (view: 'dashboard' | 'signup' | 'forgot-password') => void }> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [receiverId, setReceiverId] = useState('AS-RX-001');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!receiverId.trim() || !pin) {
      setError('Please enter Receiver ID and PIN.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.login(receiverId, pin, rememberMe);
      if (res.success && res.receiver) {
        login(res.receiver);
        onNavigate('dashboard');
      } else {
        setError(res.error || 'Invalid Receiver ID or PIN.');
      }
    } catch {
      setError('Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Receiver Access Login" subtitle="Enter your AquaSaksham Receiver ID & PIN">
      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs flex items-center space-x-2 border border-rose-200">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
            Receiver ID
          </label>
          <div className="relative">
            <Radio className="w-4 h-4 absolute left-3 top-3 text-sky-500" />
            <input
              type="text"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value.toUpperCase())}
              placeholder="e.g. AS-RX-001"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
            Receiver PIN
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (Default: 123456)"
              className="w-full pl-9 pr-10 py-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-3 text-slate-400"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 text-sky-600"
            />
            <span>Remember session</span>
          </label>
          <span className="text-[11px] text-emerald-600 flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1" /> Isolated Telemetry
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow disabled:opacity-60 flex items-center justify-center space-x-2 transition"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Connect to Receiver Dashboard</span>}
        </button>
      </form>
    </AuthLayout>
  );
};