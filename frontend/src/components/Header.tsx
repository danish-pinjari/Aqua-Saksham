import React from 'react';
import { Bell, Moon, Sun, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  hasDangerAlert?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hasDangerAlert = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="flex items-center space-x-3">
        {/* Real AquaSaksham Logo */}
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-200 dark:border-slate-700">
          <img 
            src="/logo.png" 
            alt="AquaSaksham Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-wide">AQUASAKSHAM</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              System Online
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Smart Water • Healthy Future • Sustainable Life</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-sky-500" />
          Active: <strong className="text-slate-700 dark:text-slate-200 ml-1">Node 01</strong>
        </div>

        <button 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button 
            aria-label="Notifications" 
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Bell className="w-5 h-5" />
            {hasDangerAlert && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping"></span>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
            DP
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block">Danish Pinjari</span>
        </div>
      </div>
    </header>
  );
};