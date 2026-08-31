import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">About AquaSaksham</h1>
        <p className="text-sm text-slate-500">Smart Community Health Monitoring & Early Warning System</p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Project Mission</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          AquaSaksham is engineered to provide affordable, decentralized, and real-time water quality monitoring for community water networks. Utilizing sub-gigahertz LoRa telemetry and automated anomaly evaluation, the platform ensures early detection of water contamination risks before community health is compromised.
        </p>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
          Core Hardware & Software Stack
        </h2>
        <ul className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <li className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">• ESP32 / Arduino Microcontrollers</li>
          <li className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">• LoRa SX1278 433MHz Transceivers</li>
          <li className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">• Analog pH & TDS Sensors</li>
          <li className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">• Turbidity Light-Scattering Probe</li>
          <li className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">• React 18 + TypeScript + Tailwind CSS</li>
          <li className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">• Node.js / Express REST API</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
          Project Team
        </h2>
        <div className="flex items-center space-x-6 text-sm">
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">Danish Pinjari</p>
            <p className="text-xs text-slate-400">Lead System Architect & Developer</p>
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">Aayesha Pinjari</p>
            <p className="text-xs text-slate-400">Lead Developer & Research</p>
          </div>
        </div>
      </div>
    </div>
  );
};