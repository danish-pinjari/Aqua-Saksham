import React, { useState, useEffect } from 'react';
import { Radio, Cpu, BatteryCharging } from 'lucide-react';
import { fetchLatestSensorData } from '../services/api';
import { SensorData } from '../types';

export const LiveMonitoring: React.FC = () => {
  const [data, setData] = useState<SensorData | null>(null);

  useEffect(() => {
    const fetchInterval = setInterval(async () => {
      const res = await fetchLatestSensorData();
      setData(res);
    }, 2000);
    return () => clearInterval(fetchInterval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Live Telemetry Stream</h1>
          <p className="text-sm text-slate-500">Live packet polling from LoRa Receiver Bridge</p>
        </div>
        <span className="flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse">
          <Radio className="w-3.5 h-3.5 mr-1.5" /> LIVE REFRESH (2s)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase mb-2">
            <Radio className="w-4 h-4 text-aqua-500" />
            <span>LoRa Frequency</span>
          </div>
          <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">433.00 MHz</span>
          <p className="text-xs text-emerald-600 mt-2 font-medium">Link Status: Connected</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase mb-2">
            <Cpu className="w-4 h-4 text-aqua-500" />
            <span>Node ID</span>
          </div>
          <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Node {data?.nodeId || 1}</span>
          <p className="text-xs text-slate-400 mt-2">Firmware: v2.4-AWICP</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase mb-2">
            <BatteryCharging className="w-4 h-4 text-aqua-500" />
            <span>Node Battery</span>
          </div>
          <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{data?.battery || 100}%</span>
          <p className="text-xs text-emerald-600 mt-2 font-medium">Voltage: 3.92V (Nominal)</p>
        </div>
      </div>

      <div className="p-6 bg-slate-950 text-emerald-400 font-mono rounded-xl text-xs space-y-2 border border-slate-800 shadow-inner">
        <div className="text-slate-500">// RAW JSON TELEMETRY STREAM</div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};