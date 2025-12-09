import React from 'react';
import { Globe, Shield, Zap } from 'lucide-react';

export const Intelligence: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-6">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center relative overflow-hidden h-96 flex flex-col items-center justify-center">
             <div className="absolute inset-0 opacity-20">
                {/* Abstract grid representing a map */}
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
             </div>
             
             <div className="relative z-10">
                 <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-purple-500/10">
                     <Globe className="w-12 h-12 text-purple-400" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">Global Threat Intelligence</h2>
                 <p className="text-slate-400 max-w-lg mx-auto mb-6">
                     Connecting to Sentinel Cloud to retrieve real-time IOCs (Indicators of Compromise) and YARA rule updates.
                 </p>
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm border border-emerald-500/20">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                     Live Feed Active
                 </div>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">0-Day Detection</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                    Heuristic analysis detected anomalous process injection in <code>svchost.exe</code>. No signature match found. Blocked by behavior policy.
                </p>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 w-3/4"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Confidence Score</span>
                    <span>75% (Suspicious)</span>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Policy Updates</h3>
                </div>
                <ul className="space-y-3">
                    <li className="flex justify-between text-sm">
                        <span className="text-slate-300">Ransomware Definitions</span>
                        <span className="text-emerald-400">Updated 10m ago</span>
                    </li>
                    <li className="flex justify-between text-sm">
                        <span className="text-slate-300">Network Filters</span>
                        <span className="text-emerald-400">Updated 1h ago</span>
                    </li>
                    <li className="flex justify-between text-sm">
                        <span className="text-slate-300">Core Engine</span>
                        <span className="text-slate-500">Up to date</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );
};
