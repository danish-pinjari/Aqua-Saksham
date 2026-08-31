import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplet, 
  Sparkles, 
  Lightbulb, 
  BatteryMedium, 
  Waves, 
  ChevronRight 
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { GaugeChart } from '../components/GaugeChart';
import { fetchLatestSensorData, fetchAIAnalysis } from '../services/api';
import { getMockHistoryData } from '../services/mockData';
import { SensorData, AIAnalysisData } from '../types';
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
    lastAnalysis: '17/07/2026',
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
    <div className="space-y-6">
      {/* Top Header Label */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Real-time water quality monitoring and AI-based risk analysis.</p>
      </div>

      {/* Row 1: Top 4 Metric Cards (Matching Sketch Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sketch: Current Health Risk Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Health Risk</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-3">
            <span className={`inline-block px-4 py-1.5 rounded-lg text-lg font-black tracking-wider ${riskInfo.bg}`}>
              {riskInfo.label}
            </span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            AI Prediction Status: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
          </div>
        </div>

        {/* Sketch: PH LEVEL Card */}
        <MetricCard
          title="PH LEVEL"
          value={sensor.ph.toFixed(2)}
          threshold="Range 6.5 to 8.5"
          status={sensor.ph >= 6.5 && sensor.ph <= 8.5 ? 'NORMAL' : 'WARNING'}
          icon={Droplet}
        />

        {/* Sketch: TDS LEVEL Card */}
        <MetricCard
          title="TDS LEVEL"
          value={sensor.tds}
          unit="ppm"
          threshold="Max 500 ppm"
          status={sensor.tds <= 500 ? 'NORMAL' : 'WARNING'}
          icon={Waves}
        />

        {/* Sketch: TURBIDITY Card */}
        <MetricCard
          title="TURBIDITY"
          value={sensor.turbidity.toFixed(1)}
          unit="NTU"
          threshold="Max 5 NTU"
          status={sensor.turbidity <= 5.0 ? 'NORMAL' : 'DANGER'}
          icon={BatteryMedium}
        />
      </div>

      {/* Row 2: AI Recommendation & Solution Row (Matching Sketch Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sketch: AI Recommendation Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-aqua-600 dark:text-aqua-400 mb-3">
              <Sparkles className="w-5 h-5" />
              <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">AI Recommendation</h2>
            </div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
              "{aiData.recommendation}"
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Prediction Confidence: <strong className="text-slate-600 dark:text-slate-300">{aiData.confidence}</strong></span>
            <span>Last updated: {aiData.lastAnalysis}</span>
          </div>
        </div>

        {/* Sketch: SOLUTION Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-500 mb-3">
              <Lightbulb className="w-5 h-5" />
              <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">SOLUTION</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {aiData.solution}
            </p>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => onNavigate('ai')}
              className="w-full py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition flex items-center justify-center space-x-1"
            >
              <span>Find solution / Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: 24-Hour Trends Chart & Disease Risk Probability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sketch: 24-Hour Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">24-Hour Trends</h2>
            <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800">
              {(['ph', 'tds', 'turbidity'] as const).map(param => (
                <button
                  key={param}
                  onClick={() => setTrendMetric(param)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md uppercase transition ${
                    trendMetric === param 
                      ? 'bg-white dark:bg-slate-700 text-aqua-600 dark:text-aqua-300 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {param}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={trendMetric} 
                  stroke="#0284c7" 
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#0284c7' }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sketch: Disease Risk Probability */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col items-center justify-between text-center">
          <div>
            <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">Disease Risk Probability</h2>
            <p className="text-xs text-slate-400 mt-1">Calculated based on deviation from optimal thresholds.</p>
          </div>

          <div className="my-4">
            <GaugeChart percentage={parseInt(aiData.diseaseRisk, 10) || 15} />
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-md border border-slate-100 dark:border-slate-800 w-full">
            Prototype AI Risk Estimation (AWICP Heuristic Engine)
          </div>
        </div>
      </div>
    </div>
  );
};