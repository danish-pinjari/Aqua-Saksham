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
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isOpen, 
  setIsOpen 
}) => {
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

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsOpen(false); // Mobile screen par item click karte hi drawer close hoga
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0 z-50 transition-transform duration-300 ease-in-out border-r border-slate-800 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4">
          {/* Brand header in drawer */}
          <div className="px-3 py-3 flex items-center justify-between border-b border-slate-800 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 flex-shrink-0">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-wider text-slate-100">AQUASAKSHAM</span>
                <p className="text-[10px] text-slate-400 leading-tight">IoT Water Monitor</p>
              </div>
            </div>

            {/* Mobile Close Icon */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
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
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          <div className="mt-3 px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 text-center">
            AquaSaksham Core v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
};