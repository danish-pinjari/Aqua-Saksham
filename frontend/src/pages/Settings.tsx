import React, { useState } from 'react';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [phMin, setPhMin] = useState(6.5);
  const [phMax, setPhMax] = useState(8.5);
  const [tdsMax, setTdsMax] = useState(500);
  const [turbidityMax, setTurbidityMax] = useState(5.0);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">System Parameters & Thresholds</h1>
        <p className="text-sm text-slate-500">Configure real-time trigger boundaries for water quality scoring</p>
      </div>

      <form onSubmit={handleSave} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Minimum pH</label>
            <input 
              type="number" 
              step="0.1" 
              value={phMin} 
              onChange={e => setPhMin(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-slate-100" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Maximum pH</label>
            <input 
              type="number" 
              step="0.1" 
              value={phMax} 
              onChange={e => setPhMax(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-slate-100" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Maximum TDS (ppm)</label>
          <input 
            type="number" 
            value={tdsMax} 
            onChange={e => setTdsMax(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-slate-100" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Maximum Turbidity (NTU)</label>
          <input 
            type="number" 
            step="0.1" 
            value={turbidityMax} 
            onChange={e => setTurbidityMax(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-slate-100" 
          />
        </div>

        <button 
          type="submit"
          className="flex items-center space-x-2 px-5 py-2.5 bg-aqua-600 hover:bg-aqua-700 text-white rounded-lg text-xs font-bold shadow transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Thresholds</span>
        </button>

        {saved && (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Settings updated successfully!</p>
        )}
      </form>
    </div>
  );
};