import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, Battery } from 'lucide-react';
import { fetchNodes } from '../services/api';
import { NodeItem } from '../types';

export const SensorNodes: React.FC = () => {
  const [nodes, setNodes] = useState<NodeItem[]>([]);

  useEffect(() => {
    fetchNodes().then(setNodes);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Sensor Nodes Network</h1>
        <p className="text-sm text-slate-500">Configured LoRa endpoint transceivers in the field</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map(n => (
          <div key={n.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-aqua-50 dark:bg-aqua-950/40 rounded-lg text-aqua-600">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">{n.name}</h2>
                  <span className="text-xs text-slate-400">ID: {n.id} | Protocol: LoRa 433MHz</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${n.status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {n.status}
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-500">
                <Battery className="w-4 h-4" />
                <span>Battery: <strong>{n.battery}%</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-500">
                <Wifi className="w-4 h-4" />
                <span>Last packet: <strong>{n.last_seen}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};