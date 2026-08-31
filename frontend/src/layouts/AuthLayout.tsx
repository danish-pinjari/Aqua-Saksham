import React from 'react';
import { Activity, ShieldCheck, Waves, Cpu, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors">
      {/* LEFT COLUMN: Brand & IoT Highlights (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 p-12 flex-col justify-between overflow-hidden border-r border-slate-800 select-none">
        {/* Subtle Water-Wave Background Gradients */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shadow-md flex-shrink-0">
              <img src="/logo.png" alt="AquaSaksham Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">AQUASAKSHAM</span>
              <p className="text-xs text-sky-400 font-medium">Smart Community Health Monitoring</p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
            <Activity className="w-3.5 h-3.5 mr-2 text-sky-400" />
            IoT Telemetry & Early Warning System
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Real-time water quality monitoring and intelligent risk detection for safer communities.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Continuous sub-gigahertz LoRa sensing for pH, TDS, Turbidity, and predictive water safety assessment.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
              <h2 className="text-xs font-bold text-slate-200">Real-Time Telemetry</h2>
              <p className="text-[11px] text-slate-400">Live parameter streaming</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
              <Waves className="w-4 h-4 text-sky-400 mb-1.5" />
              <h2 className="text-xs font-bold text-slate-200">Sensor Suite</h2>
              <p className="text-[11px] text-slate-400">pH, TDS & Turbidity bounds</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
              <Cpu className="w-4 h-4 text-amber-400 mb-1.5" />
              <h2 className="text-xs font-bold text-slate-200">LoRa Node Gateway</h2>
              <p className="text-[11px] text-slate-400">Long range 433MHz bridge</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400 mb-1.5" />
              <h2 className="text-xs font-bold text-slate-200">AI Risk Detection</h2>
              <p className="text-[11px] text-slate-400">Automated safety heuristics</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 flex justify-between items-center border-t border-slate-800/80 pt-4">
          <span>AquaSaksham Core v1.0.0</span>
          <span>© 2026 AquaSaksham</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-Only Header Branding */}
          <div className="lg:hidden flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 shadow-sm border border-slate-200 dark:border-slate-800">
              <img src="/logo.png" alt="AquaSaksham Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-800 dark:text-slate-100">AQUASAKSHAM</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart Community Health Monitoring</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            </div>

            {children}
          </div>

          <div className="text-center text-xs text-slate-400 space-y-1">
            <p>© 2026 AquaSaksham</p>
            <p className="text-[11px]">Smart Water • Healthy Future • Sustainable Life</p>
          </div>
        </div>
      </div>
    </div>
  );
};