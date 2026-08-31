import { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplets, 
  FlaskConical, 
  Waves, 
  Battery, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Radio, 
  RefreshCw,
  TrendingUp,
  Sliders,
  Bell,
  Cpu
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { fetchLatestSensorData, fetchAIAnalysis, fetchAlerts } from '../services/api';
import { SensorData, AIAnalysisData } from '../types';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { receiver } = useAuth();
  const [sensor, setSensor] = useState<SensorData | null>(null);
  const [aiData, setAiData] = useState<AIAnalysisData | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadData = async () => {
    try {
      const [latestSensor, latestAI] = await Promise.all([
        fetchLatestSensorData(),
        fetchAIAnalysis(),
        fetchAlerts()
      ]);

      if (latestSensor) {
        setSensor(latestSensor);
        
        // Dynamic chart telemetry feed
        setHistoryData((prev) => {
          const newEntry = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            ph: Number(latestSensor.ph),
            tds: Number(latestSensor.tds),
            turbidity: Number(latestSensor.turbidity)
          };
          const updated = [...prev, newEntry];
          return updated.slice(-12); // Keep last 12 dynamic ticks
        });
      }

      setAiData(latestAI);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('[Dashboard Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadData();

    const timer = setInterval(() => {
      if (isMounted) loadData();
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const phVal = Number(sensor?.ph ?? 7.0);
  const tdsVal = Number(sensor?.tds ?? 0);
  const turbidityVal = Number(sensor?.turbidity ?? 0);
  const batteryVal = Number(sensor?.battery ?? 100);
  const riskVal = Number(sensor?.risk ?? 0);

  const getRiskDetails = (risk: number) => {
    if (risk === 2) {
      return {
        badge: 'DANGER (Critical Alert)',
        bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: <ShieldAlert className="w-4 h-4 text-rose-500 mr-1.5" />,
        text: 'Contaminant levels exceed safe threshold. Filtration & alert active.'
      };
    }
    if (risk === 1) {
      return {
        badge: 'WARNING (Moderate Risk)',
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: <AlertTriangle className="w-4 h-4 text-amber-500 mr-1.5" />,
        text: 'One or more parameters outside optimal drinking baseline.'
      };
    }
    return {
      badge: 'SAFE (Optimal Quality)',
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" />,
      text: 'Water parameters are completely potable and safe.'
    };
  };

  const riskInfo = getRiskDetails(riskVal);

  if (isLoading && !sensor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Synchronizing LoRa Telemetry Gateway...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white">
                {receiver?.username || 'Community Well Station'}
              </h1>
              <p className="text-xs text-slate-400">
                Receiver ID: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{receiver?.receiver_id || 'AS-RX-001'}</span> • Gateway Node: #{sensor?.nodeId || 1}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex items-center px-3 py-1.5 rounded-xl border text-xs font-semibold ${riskInfo.bg}`}>
            {riskInfo.icon}
            <span>{riskInfo.badge}</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono border border-slate-200 dark:border-slate-700">
            <RefreshCw className="w-3.5 h-3.5 text-sky-500 animate-spin" />
            <span>{lastUpdated || 'Live Feed'}</span>
          </div>
        </div>
      </div>

      {/* 4 Sensor Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* pH Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>pH Level</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono">
              {phVal.toFixed(2)}
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              phVal < 6.5 || phVal > 8.5 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {phVal < 6.5 ? 'Acidic' : phVal > 8.5 ? 'Alkaline' : 'Normal'}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">Target Range: 6.50 – 8.50 pH</div>
        </div>

        {/* TDS Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Dissolved Solids</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono">
              {tdsVal.toFixed(0)} <span className="text-sm font-normal text-slate-400">ppm</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              tdsVal > 500 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {tdsVal > 500 ? 'High' : 'Good'}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">Standard: &lt; 500 ppm</div>
        </div>

        {/* Turbidity Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Turbidity</span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-500">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono">
              {turbidityVal.toFixed(2)} <span className="text-sm font-normal text-slate-400">NTU</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              turbidityVal > 5.0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {turbidityVal > 5.0 ? 'Turbid' : 'Clear'}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">Threshold: &lt; 5.00 NTU</div>
        </div>

        {/* Battery Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Transmitter Battery</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
              <Battery className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono">
              {batteryVal.toFixed(1)} <span className="text-sm font-normal text-slate-400">%</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Sub-GHz LoRa
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">Frequency: 433 MHz Bridge</div>
        </div>
      </div>

      {/* Live Trends Graph Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-sky-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Real-Time Telemetry Stream
            </h2>
          </div>
          <span className="text-xs text-slate-400">Auto-refreshing every 2.5s</span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData.length > 0 ? historyData : [{ time: 'Now', ph: phVal, tds: tdsVal, turbidity: turbidityVal }]}>
              <defs>
                <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px'
                }} 
              />
              <Area type="monotone" dataKey="ph" name="pH Value" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorPh)" />
              <Area type="monotone" dataKey="turbidity" name="Turbidity (NTU)" stroke="#06b6d4" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Assessment & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Health Advisory */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-sky-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                AI Heuristic Water Health Advisory
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              Confidence: {aiData?.confidence || 94}%
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            {riskInfo.text}
          </p>

          <div className="space-y-2">
            {(aiData?.recommendation ? [aiData.recommendation] : [
              'Verify sensor probe immersion in sample well.',
              'Inspect physical LoRa transmission link on Node 1.'
            ]).map((rec, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Nav Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">
              Quick Controls
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onNavigate && onNavigate('history')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-left transition flex flex-col justify-between h-20 border border-slate-200 dark:border-slate-700"
              >
                <TrendingUp className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Logs History</span>
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('alerts')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-left transition flex flex-col justify-between h-20 border border-slate-200 dark:border-slate-700"
              >
                <Bell className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Alert Center</span>
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('nodes')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-left transition flex flex-col justify-between h-20 border border-slate-200 dark:border-slate-700"
              >
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Node Hub</span>
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('settings')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-left transition flex flex-col justify-between h-20 border border-slate-200 dark:border-slate-700"
              >
                <Sliders className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Thresholds</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>System Status</span>
            <span className="text-emerald-500 font-bold flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5" />
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;