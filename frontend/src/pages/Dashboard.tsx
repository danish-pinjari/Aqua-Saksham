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
  RefreshCw 
} from 'lucide-react';
import { fetchLatestSensorData, fetchAIAnalysis, fetchAlerts } from '../services/api';
import { SensorData, AIAnalysisData, AlertItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { receiver } = useAuth();
  const [sensor, setSensor] = useState<SensorData | null>(null);
  const [aiData, setAiData] = useState<AIAnalysisData | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadDashboardData = async () => {
    try {
      const [latestSensor, latestAI, latestAlerts] = await Promise.all([
        fetchLatestSensorData(),
        fetchAIAnalysis(),
        fetchAlerts()
      ]);

      setSensor(latestSensor);
      setAiData(latestAI);
      setAlerts(latestAlerts);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('[Dashboard] Error polling live data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    loadDashboardData();
    // Live Polling every 2.5 seconds to reflect ESP32 LoRa uploads
    const interval = setInterval(() => {
      if (isMounted) {
        loadDashboardData();
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getRiskBadge = (risk: number) => {
    if (risk === 2) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <ShieldAlert className="w-3.5 h-3.5 mr-1" /> DANGER (Critical)
        </span>
      );
    } else if (risk === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-3.5 h-3.5 mr-1" /> WARNING (Moderate)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> SAFE (Optimal)
      </span>
    );
  };

  const getPhStatus = (ph: number) => {
    if (ph < 6.5) return { label: 'Acidic', color: 'text-amber-500' };
    if (ph > 8.5) return { label: 'Alkaline', color: 'text-rose-500' };
    return { label: 'Ideal', color: 'text-emerald-500' };
  };

  const getTdsStatus = (tds: number) => {
    if (tds > 500) return { label: 'Poor (High TDS)', color: 'text-rose-500' };
    if (tds > 300) return { label: 'Fair', color: 'text-amber-500' };
    return { label: 'Excellent', color: 'text-emerald-500' };
  };

  const getTurbidityStatus = (turbidity: number) => {
    if (turbidity > 5.0) return { label: 'Turbid / Clouded', color: 'text-rose-500' };
    if (turbidity > 2.0) return { label: 'Moderate', color: 'text-amber-500' };
    return { label: 'Crystal Clear', color: 'text-emerald-500' };
  };

  if (isLoading && !sensor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Connecting to LoRa Telemetry Gateway...
        </p>
      </div>
    );
  }

  const phVal = Number(sensor?.ph ?? 7.0);
  const tdsVal = Number(sensor?.tds ?? 0);
  const turbidityVal = Number(sensor?.turbidity ?? 0);
  const batteryVal = Number(sensor?.battery ?? 100);
  const riskVal = Number(sensor?.risk ?? 0);

  const phInfo = getPhStatus(phVal);
  const tdsInfo = getTdsStatus(tdsVal);
  const turbidityInfo = getTurbidityStatus(turbidityVal);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-sky-500 animate-pulse" />
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              {receiver?.username || 'Telemetry Station AS-RX-001'}
            </h1>
            {getRiskBadge(riskVal)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Receiver ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{receiver?.receiver_id || 'AS-RX-001'}</span> | 
            Node Gateway: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">Node #{sensor?.nodeId || 1}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <RefreshCw className="w-3.5 h-3.5 text-sky-500 animate-spin" />
            <span>Updated: {lastUpdated || 'Streaming'}</span>
          </div>
        </div>
      </div>

      {/* Sensor Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* pH Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">pH Level</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {phVal.toFixed(2)}
            </div>
            <span className={`text-xs font-semibold ${phInfo.color}`}>
              {phInfo.label}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">Target Range: 6.50 – 8.50 pH</div>
        </div>

        {/* TDS Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Dissolved Solids</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {tdsVal.toFixed(0)} <span className="text-sm font-normal text-slate-400">ppm</span>
            </div>
            <span className={`text-xs font-semibold ${tdsInfo.color}`}>
              {tdsInfo.label}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">Standard: &lt; 500 ppm</div>
        </div>

        {/* Turbidity Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Turbidity</span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:cyan-950/60 text-cyan-500">
              <Waves className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {turbidityVal.toFixed(2)} <span className="text-sm font-normal text-slate-400">NTU</span>
            </div>
            <span className={`text-xs font-semibold ${turbidityInfo.color}`}>
              {turbidityInfo.label}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">Threshold: &lt; 5.00 NTU</div>
        </div>

        {/* Battery & Gateway Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Node Battery</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
              <Battery className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {batteryVal.toFixed(1)} <span className="text-sm font-normal text-slate-400">%</span>
            </div>
            <span className="text-xs font-semibold text-emerald-500">
              {batteryVal > 20 ? 'Optimal' : 'Low Power'}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">Link: Sub-GHz LoRa (433MHz)</div>
        </div>
      </div>

      {/* AI Risk Assessment & Recent System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Analysis Panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-sky-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                AI Heuristic Water Health Assessment
              </h2>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-medium">
              Confidence: {aiData?.confidence || 95}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-4">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Diagnosis: {riskVal === 2 ? 'Water Safety Alert — Contaminants Detected' : (riskVal === 1 ? 'Water Safety Warning' : 'Potable & Safe For Consumption')}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {riskVal === 2 
                ? 'High alkalinity or suspended particulates detected outside permissible limits. Water filtration and neutralizing treatment are required before distribution.'
                : 'Current parameters reflect standard drinking water specifications with balanced minerals and minimal turbidity.'}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Recommended Remediation Steps:
            </h3>
            <ul className="space-y-2">
              {(aiData?.recommendation ? [aiData.recommendation] : [
                'Ensure carbon filtration media is backwashed regularly.',
                'Maintain calibrated standard buffer solutions for periodic pH probe checks.'
              ]).map((rec, i) => (
                <li key={i} className="text-xs flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live Alerts Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Recent Alerts
            </h2>
            {onNavigate && (
              <button 
                onClick={() => onNavigate('alerts')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                View All
              </button>
            )}
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[260px]">
            {alerts && alerts.length > 0 ? (
              alerts.slice(0, 4).map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border text-xs flex items-start space-x-3 ${
                    alert.severity === 'danger' 
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300' 
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold">{alert.type || 'Telemetry Alert'}</div>
                    <div className="text-[11px] opacity-90 mt-0.5">{alert.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                <span>No active critical alerts</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;