import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { getMockHistoryData } from '../services/mockData';

export const History: React.FC = () => {
  const [data] = useState(getMockHistoryData(15));

  const exportCSV = () => {
    const header = "Time,pH,TDS (ppm),Turbidity (NTU)\n";
    const rows = data.map(d => `${d.time},${d.ph},${d.tds},${d.turbidity}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquasaksham_history_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Sensor History</h1>
          <p className="text-sm text-slate-500">Historical telemetry log and threshold audits</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-aqua-600 hover:bg-aqua-700 text-white rounded-lg text-xs font-semibold shadow transition"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Node</th>
                <th className="p-4">pH Level</th>
                <th className="p-4">TDS (ppm)</th>
                <th className="p-4">Turbidity (NTU)</th>
                <th className="p-4">Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 font-mono">{row.time}</td>
                  <td className="p-4 font-semibold">Node 01</td>
                  <td className="p-4">{row.ph}</td>
                  <td className="p-4">{row.tds}</td>
                  <td className="p-4">{row.turbidity}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      SAFE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};