import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, ShieldAlert } from 'lucide-react';
import { fetchAIAnalysis } from '../services/api';
import { AIAnalysisData } from '../types';

export const AIAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<AIAnalysisData | null>(null);

  useEffect(() => {
    fetchAIAnalysis().then(setAnalysis);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">AI Risk Analysis & Diagnostic Engine</h1>
        <p className="text-sm text-slate-500">Heuristic early warning and prospective ML anomaly evaluation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Engine Status</span>
          <div className="flex items-center space-x-2 mt-2">
            <BrainCircuit className="w-5 h-5 text-aqua-500" />
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{analysis?.status}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Confidence: {analysis?.confidence}</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Disease Risk Score</span>
          <div className="flex items-center space-x-2 mt-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{analysis?.diseaseRisk}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Deviation heuristic: Safe margin</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Architecture Mode</span>
          <div className="flex items-center space-x-2 mt-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">Rule-Heuristic</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Ready for LSTM / Random Forest</p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Diagnostic Summary</h2>
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Recommendation:</p>
          <p className="text-slate-600 dark:text-slate-400">{analysis?.recommendation}</p>
        </div>
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-sm">
          <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Prescribed Action:</p>
          <p className="text-emerald-700 dark:text-emerald-400">{analysis?.solution}</p>
        </div>
      </div>
    </div>
  );
};