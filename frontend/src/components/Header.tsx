import React from 'react';
import { Bell, Moon, Sun, Menu, X, Radio } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  hasDangerAlert?: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  hasDangerAlert = false,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  const { theme, toggleTheme } = useTheme();
  const { receiver } = useAuth() as any; // Type assertion as temporary fix

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="flex items-center space-x-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* AquaSaksham Logo */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0">
          <img src="/logo.png" alt="AquaSaksham Logo" className="w-full h-full object-cover" />
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 tracking-wide">AQUASAKSHAM</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {receiver?.status || 'Online'}
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-xs md:max-w-none">
            Smart Water • Healthy Future • Sustainable Life
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Dynamic Receiver Identity Badge */}
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 px-3 py-1.5 rounded-lg">
          <Radio className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Receiver: <strong className="text-sky-700 dark:text-sky-300 font-mono">{receiver?.receiver_id || 'AS-RX-001'}</strong></span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span>Node: <strong className="text-slate-800 dark:text-slate-100">#{receiver?.node_id || 1}</strong></span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {/* Alerts Bell */}
        <div className="relative">
          <button aria-label="Notifications" className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {hasDangerAlert && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping"></span>
            )}
          </button>
        </div>

        {/* User / Unit Tag */}
        <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
            {receiver?.receiver_id?.slice(-3) || 'RX'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[120px]">{receiver?.username || 'Community Well 01'}</p>
            <p className="text-[10px] text-slate-400 leading-tight font-mono">{receiver?.receiver_id || 'AS-RX-001'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};