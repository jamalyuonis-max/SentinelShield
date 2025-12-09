import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Shield, Cloud, Bell, Cpu, Wifi, Download, Trash2, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

interface SettingsState {
    realTimeProtection: boolean;
    cloudAnalysis: boolean;
    notifications: boolean;
    gamingMode: boolean;
    autoUpdate: boolean;
    networkFilter: boolean;
    agentInstalled: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
    realTimeProtection: true,
    cloudAnalysis: true,
    notifications: true,
    gamingMode: false,
    autoUpdate: true,
    networkFilter: true,
    agentInstalled: true
};

export const Settings: React.FC = () => {
    const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = useState(false);
    const [processingAction, setProcessingAction] = useState<'install' | 'uninstall' | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('sentinel_settings');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
        setLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (loaded) {
            localStorage.setItem('sentinel_settings', JSON.stringify(settings));
        }
    }, [settings, loaded]);

    const toggle = (key: keyof SettingsState) => {
        if (!settings.agentInstalled && key !== 'agentInstalled') return; // Cannot toggle settings if uninstalled
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleInstall = () => {
        setProcessingAction('install');
        setTimeout(() => {
            setSettings(prev => ({
                ...prev,
                agentInstalled: true,
                realTimeProtection: true,
                networkFilter: true
            }));
            setProcessingAction(null);
        }, 2500);
    };

    const handleUninstall = () => {
        if (window.confirm("WARNING: Uninstalling the agent will leave this endpoint vulnerable. Are you sure you want to proceed?")) {
            setProcessingAction('uninstall');
            setTimeout(() => {
                setSettings(prev => ({
                    ...prev,
                    agentInstalled: false,
                    realTimeProtection: false,
                    networkFilter: false,
                    cloudAnalysis: false
                }));
                setProcessingAction(null);
            }, 3000);
        }
    };

    if (!loaded) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Policy Settings</h2>
                <p className="text-slate-400">Configure global protection policies and agent behavior.</p>
            </div>

            {!settings.agentInstalled && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-400 mb-6 animate-pulse">
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                    <div>
                        <p className="font-bold">Protection Disabled</p>
                        <p className="text-sm text-rose-300/80">The security agent is currently uninstalled. This device is at risk.</p>
                    </div>
                </div>
            )}

            <div className={`grid grid-cols-1 gap-4 transition-opacity duration-300 ${!settings.agentInstalled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
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
            
            <div className="mt-8 border-t border-slate-800 pt-8">
                <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Agent Management</h3>
                
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-full ${settings.agentInstalled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {settings.agentInstalled ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white">
                                    {settings.agentInstalled ? 'Sentinel Agent Installed' : 'Agent Not Installed'}
                                </h4>
                                <p className="text-sm text-slate-400">
                                    {settings.agentInstalled 
                                        ? 'Version 4.2.0 is active and running.' 
                                        : 'Install the agent to enable protection features.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {!settings.agentInstalled ? (
                                <button 
                                    onClick={handleInstall}
                                    disabled={processingAction === 'install'}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processingAction === 'install' ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" /> Installing...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" /> Install Agent
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleUninstall}
                                    disabled={processingAction === 'uninstall'}
                                    className="px-6 py-3 bg-slate-700 hover:bg-rose-600 hover:text-white text-slate-200 border border-slate-600 hover:border-rose-500 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {processingAction === 'uninstall' ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" /> Uninstalling...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5 group-hover:animate-bounce" /> Uninstall
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl flex justify-between items-center">
                <div>
                    <p className="text-white font-medium">Export System Logs</p>
                    <p className="text-xs text-slate-500">Download encrypted logs for forensic analysis.</p>
                </div>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                    Export Logs
                </button>
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
    <div className={`bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors ${!active ? 'opacity-80' : ''}`}>
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