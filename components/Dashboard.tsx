import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, AlertTriangle, FileSearch, Server, Activity } from 'lucide-react';
import { SystemStats } from '../types';

interface DashboardProps {
  stats: SystemStats;
}

const data = [
  { name: '00:00', threats: 2 },
  { name: '04:00', threats: 1 },
  { name: '08:00', threats: 5 },
  { name: '12:00', threats: 3 },
  { name: '16:00', threats: 8 },
  { name: '20:00', threats: 2 },
  { name: '24:00', threats: 1 },
];

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ShieldCheck className="w-48 h-48 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" /> System Protected
            </h2>
            <p className="text-slate-300 max-w-lg mb-6">
              Real-time protection is active. Neural heuristic engine is monitoring for suspicious behavior patterns.
            </p>
            <div className="flex gap-4">
              <div className="bg-slate-950/50 rounded-lg px-4 py-2 border border-slate-700/50">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Signatures</span>
                <p className="font-mono text-emerald-400">99.98%</p>
              </div>
              <div className="bg-slate-950/50 rounded-lg px-4 py-2 border border-slate-700/50">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Network</span>
                <p className="font-mono text-emerald-400">SECURE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <div className="relative">
                <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 rounded-full"></div>
                <AlertTriangle className="w-12 h-12 text-rose-500 mb-4 relative z-10" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.threatsBlocked}</h3>
            <p className="text-sm text-slate-400 font-medium">Threats Blocked (24h)</p>
            <div className="mt-4 text-xs text-rose-400 bg-rose-950/30 px-2 py-1 rounded border border-rose-900">
                +12 Detected since yesterday
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            icon={<FileSearch className="text-blue-400" />} 
            label="Files Scanned" 
            value={stats.protectedFiles.toLocaleString()} 
            subValue="Today"
        />
        <StatCard 
            icon={<Server className="text-purple-400" />} 
            label="Memory Usage" 
            value={`${stats.memoryUsage}%`} 
            subValue="Stable"
        />
        <StatCard 
            icon={<Activity className="text-amber-400" />} 
            label="CPU Load" 
            value={`${stats.cpuLoad}%`} 
            subValue="Low Overhead"
        />
        <StatCard 
            icon={<ShieldCheck className="text-emerald-400" />} 
            label="Last Scan" 
            value={stats.lastScan} 
            subValue="Full System"
        />
      </div>

      {/* Main Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Threat Detection Timeline</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }}
                itemStyle={{ color: '#f43f5e' }}
              />
              <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, subValue: string }> = ({ icon, label, value, subValue }) => (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-colors">
        <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
            {icon}
        </div>
        <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500">{subValue}</p>
        </div>
    </div>
);
