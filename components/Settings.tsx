import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Shield, Cloud, Bell, Cpu, Wifi } from 'lucide-react';

export const Settings: React.FC = () => {
    const [settings, setSettings] = useState({
        realTimeProtection: true,
        cloudAnalysis: true,
        notifications: true,
        gamingMode: false,
        autoUpdate: true,
        networkFilter: true
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Policy Settings</h2>
                <p className="text-slate-400">Configure global protection policies and agent behavior.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <SettingCard 
                    title="Real-time Protection" 
                    desc="Continuously monitors file system and memory for malicious activity."
                    icon={<Shield className="text-emerald-400" />}
                    active={settings.realTimeProtection}
                    onToggle={() => toggle('realTimeProtection')}
                />
                
                <SettingCard 
                    title="Cloud Analysis & Intelligence" 
                    desc="Uploads suspicious file hashes to Sentinel Cloud for deep analysis."
                    icon={<Cloud className="text-blue-400" />}
                    active={settings.cloudAnalysis}
                    onToggle={() => toggle('cloudAnalysis')}
                />

                <SettingCard 
                    title="Network Intrusion Prevention" 
                    desc="Filters network traffic to block exploit attempts and botnet communication."
                    icon={<Wifi className="text-purple-400" />}
                    active={settings.networkFilter}
                    onToggle={() => toggle('networkFilter')}
                />

                <SettingCard 
                    title="Gaming / Low Latency Mode" 
                    desc="Suppress background scans and notifications while full-screen apps are running."
                    icon={<Cpu className="text-amber-400" />}
                    active={settings.gamingMode}
                    onToggle={() => toggle('gamingMode')}
                />

                <SettingCard 
                    title="Desktop Notifications" 
                    desc="Show alerts for detected threats and system events."
                    icon={<Bell className="text-slate-400" />}
                    active={settings.notifications}
                    onToggle={() => toggle('notifications')}
                />
            </div>
            
            <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Advanced</h3>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-white font-medium">Export System Logs</p>
                        <p className="text-xs text-slate-500">Download encrypted logs for forensic analysis.</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                        Export Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

interface SettingCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    active: boolean;
    onToggle: () => void;
}

const SettingCard: React.FC<SettingCardProps> = ({ title, desc, icon, active, onToggle }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-lg">
                {icon}
            </div>
            <div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm text-slate-400">{desc}</p>
            </div>
        </div>
        <button onClick={onToggle} className="text-slate-500 hover:text-white transition-colors focus:outline-none">
            {active ? (
                <ToggleRight className="w-10 h-10 text-emerald-500 fill-current" />
            ) : (
                <ToggleLeft className="w-10 h-10 text-slate-600" />
            )}
        </button>
    </div>
);
