import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  History as HistoryIcon, 
  Cpu, 
  BellRing, 
  CpuIcon, 
  Settings as SettingsIcon, 
  Info, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Monitoring', icon: Activity },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'ai', label: 'AI Analysis', icon: Cpu },
    { id: 'alerts', label: 'Alerts', icon: BellRing },
    { id: 'nodes', label: 'Sensor Nodes', icon: CpuIcon },
    { id: 'settings', label: 'Setting', icon: SettingsIcon },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0 min-h-screen border-r border-slate-800 select-none">
      <div className="p-4">
        <div className="px-3 py-3 flex items-center space-x-3 border-b border-slate-800 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-wider text-slate-100">AQUASAKSHAM</span>
            <p className="text-[10px] text-slate-400 leading-tight">IoT Water Monitor</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        <div className="mt-4 px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-500 text-center">
          AquaSaksham Core v1.0.0
        </div>
      </div>
    </aside>
  );
};