import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { fetchAlerts } from '../services/api';
import { AlertItem } from '../types';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    fetchAlerts().then(setAlerts);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">System Alerts & Incidents</h1>
        <p className="text-sm text-slate-500">Autonomous triggers from sensor threshold evaluation rules</p>
      </div>

      <div className="space-y-3">
        {alerts.map(a => (
          <div key={a.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between shadow-sm">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${a.severity === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{a.type}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{a.message}</p>
                <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {a.timestamp}</span>
                  <span>Node: #{a.node_id}</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};