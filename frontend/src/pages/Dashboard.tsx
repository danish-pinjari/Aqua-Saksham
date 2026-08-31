import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplet, 
  Sparkles, 
  Lightbulb, 
  Waves, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { GaugeChart } from '../components/GaugeChart';
import { fetchLatestSensorData, fetchAIAnalysis } from '../services/api';
import { getMockHistoryData } from '../services/mockData';
import { SensorData, AIAnalysisData } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const Dashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { receiver } = useAuth();
  const [sensor, setSensor] = useState<SensorData>({
    nodeId: 1,
    ph: 7.50,
    tds: 370,
    turbidity: 3.5,
    battery: 100,
    risk: 0,
    timestamp: new Date().toISOString()
  });

  const [aiData, setAiData] = useState<AIAnalysisData>({
    status: 'Active',
    confidence: '92%',
    lastAnalysis: 'Live',
    risk: 'SAFE',
    diseaseRisk: '15%',
    recommendation: 'Water quality is stable. No action required.',
    solution: 'No secondary treatment warranted at this point.',
    type: 'Prototype AI Risk Estimation'
  });

  const [trendMetric, setTrendMetric] = useState<'ph' | 'tds' | 'turbidity'>('ph');
  const [history] = useState(getMockHistoryData(10));

  useEffect(() => {
    const load = async () => {
      const s = await fetchLatestSensorData();
      const a = await fetchAIAnalysis();
      setSensor(s);
      setAiData(a);
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRiskBadge = (risk: number) => {
    if (risk === 0) return { label: 'SAFE', bg: 'bg-emerald-500 text-white' };
    if (risk === 1) return { label: 'WARNING', bg: 'bg-amber-500 text-white' };
    return { label: 'DANGER', bg: 'bg-rose-500 text-white' };
  };

  const riskInfo = getRiskBadge(sensor.risk);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Top Header Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Real-time water quality monitoring & risk diagnostics.</p>
        </div>
        
        {/* Mobile Receiver Tag */}
        <div className="md:hidden flex items-center space-x-2 text-[11px] bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 p-2 rounded-lg text-sky-700 dark:text-sky-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Receiver: <strong>{receiver?.receiver_id || 'AS-RX-001'}</strong> (Node #{receiver?.node_id || 1})</span>
        </div>
      </div>

      {/* Row 1: Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Current Health Risk Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Health Risk</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-3">
            <span className={`inline-block px-3.5 py-1 rounded-lg text-base sm:text-lg font-black tracking-wider ${riskInfo.bg}`}>
              {riskInfo.label}
            </span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            AI Status: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
          </div>
        </div>

        {/* PH LEVEL Card */}
        <MetricCard
          title="PH LEVEL"
          value={sensor.ph.toFixed(2)}
          threshold="Range 6.5 to 8.5"
          status={sensor.ph >= 6.5 && sensor.ph <= 8.5 ? 'NORMAL' : 'WARNING'}
          icon={Droplet}
        />

        {/* TDS LEVEL Card */}
        <MetricCard
          title="TDS LEVEL"
          value={sensor.tds}
          unit="ppm"
          threshold="Max 500 ppm"
          status={sensor.tds <= 500 ? 'NORMAL' : 'WARNING'}
          icon={Waves}
        />

        {/* TURBIDITY Card */}
        <MetricCard
          title="TURBIDITY"
          value={sensor.turbidity.toFixed(1)}
          unit="NTU"
          threshold="Max 5 NTU"
          status={sensor.turbidity <= 5.0 ? 'NORMAL' : 'DANGER'}
          icon={Activity}
        />
      </div>

      {/* Row 2: AI Recommendation & Solution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 mb-2 sm:mb-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">AI Recommendation</h2>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200">
              "{aiData.recommendation}"
            </p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-400">
            <span>Confidence: <strong className="text-slate-600 dark:text-slate-300">{aiData.confidence}</strong></span>
            <span>Last evaluated: {aiData.lastAnalysis}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-500 mb-2 sm:mb-3">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">ACTION PLAN</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {aiData.solution}
            </p>
          </div>

          <div className="mt-4">
            <button 
              onClick={() => onNavigate('ai')}
              className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition flex items-center justify-center space-x-1"
            >
              <span>View Full Diagnostics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: 24-Hour Trends Chart & Disease Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* 24-Hour Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h2 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">24-Hour Water Trends</h2>
            <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
              {(['ph', 'tds', 'turbidity'] as const).map(param => (
                <button
                  key={param}
                  onClick={() => setTrendMetric(param)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md uppercase transition ${
                    trendMetric === param 
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {param}
                </button>
              ))}
            </div>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line 
                  type="monotone" 
                  dataKey={trendMetric} 
                  stroke="#0284c7" 
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#0284c7' }}
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Risk Probability */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col items-center justify-between text-center">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">Disease Risk Estimation</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Threshold deviation heuristic</p>
          </div>

          <div className="my-3 flex justify-center">
            <GaugeChart percentage={parseInt(aiData.diseaseRisk, 10) || 15} />
          </div>

          <div className="text-[10px] sm:text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-md border border-slate-100 dark:border-slate-800 w-full">
            Heuristic Diagnostic Mode
          </div>
        </div>
      </div>
    </div>
  );
};