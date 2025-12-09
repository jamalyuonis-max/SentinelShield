import React, { useState, useEffect, useRef } from 'react';
import { ScanType } from '../types';
import { Play, Square, FileCheck, FolderSearch, HardDrive, AlertTriangle, Trash2, CheckCircle, ShieldAlert, Loader, Shield, X } from 'lucide-react';

type ScanStatus = 'idle' | 'scanning' | 'review' | 'cleaning' | 'finished';

interface DetectedThreat {
    id: string;
    name: string;
    path: string;
    severity: 'High' | 'Medium' | 'Low';
}

interface ScanHistoryItem {
    id: number;
    type: string;
    date: string;
    duration: string;
    threats: number;
    status: 'Clean' | 'Infected' | 'Cleaned';
}

export const ScanCenter: React.FC = () => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [scanType, setScanType] = useState<ScanType | null>(null);
  const [detectedThreats, setDetectedThreats] = useState<DetectedThreat[]>([]);
  const [history, setHistory] = useState<ScanHistoryItem[]>([
      { id: 1, type: 'Full System Scan', date: '2 days ago', duration: '45m 12s', threats: 2, status: 'Cleaned' },
      { id: 2, type: 'Quick Scan', date: '3 days ago', duration: '2m 30s', threats: 0, status: 'Clean' },
      { id: 3, type: 'Custom Scan', date: '5 days ago', duration: '12m 05s', threats: 0, status: 'Clean' },
  ]);

  // Use a ref to control the detection frequency to avoid spamming threats
  const nextThreatCheck = useRef(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (status === 'scanning' && progress < 100) {
      interval = setInterval(() => {
        // Increment progress
        setProgress(prev => {
            const next = prev + (Math.random() * 1.5);
            return next > 100 ? 100 : next;
        });
        
        // Mock file paths
        const paths = [
            'C:\\Windows\\System32\\drivers\\',
            'C:\\Users\\Admin\\AppData\\Local\\Temp\\',
            'C:\\Program Files\\Common Files\\System\\',
            'Registry::HKEY_LOCAL_MACHINE\\SOFTWARE\\',
            'Memory::Heap\\Process\\',
        ];
        const randomFile = paths[Math.floor(Math.random() * paths.length)] + Math.random().toString(36).substring(7);
        setCurrentFile(randomFile);

        // Randomly simulate a threat detection
        if (progress > 10 && progress < 90 && Date.now() > nextThreatCheck.current) {
            // 10% chance to find a threat every check interval
            if (Math.random() > 0.85) {
                const threatNames = ['Trojan.Win32.Agent', 'Ransom.WannaCry.Gen', 'Adware.Toolbar.Search', 'Spyware.KeyLogger.X', 'Exploit.Heuristic.12'];
                const severities: ('High' | 'Medium' | 'Low')[] = ['High', 'High', 'Medium', 'High', 'Low'];
                const idx = Math.floor(Math.random() * threatNames.length);
                
                const newThreat: DetectedThreat = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: threatNames[idx],
                    path: randomFile,
                    severity: severities[idx]
                };
                
                setDetectedThreats(prev => [...prev, newThreat]);
                // Set next check to be at least 2 seconds later to pace detections
                nextThreatCheck.current = Date.now() + 2000; 
            }
        }

      }, 100);
    } else if (progress >= 100 && status === 'scanning') {
       // Scan finished
       if (detectedThreats.length > 0) {
           setStatus('review');
       } else {
           finishScan(0);
       }
    } else if (status === 'cleaning') {
        // Simulate cleaning delay
        const timer = setTimeout(() => {
            finishScan(detectedThreats.length);
        }, 2000);
        return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [status, progress, detectedThreats]);

  const startScan = (type: ScanType) => {
    setScanType(type);
    setStatus('scanning');
    setProgress(0);
    setDetectedThreats([]);
    nextThreatCheck.current = Date.now() + 1000;
  };

  const stopScan = () => {
    setStatus('idle');
    setProgress(0);
    setScanType(null);
    setDetectedThreats([]);
  };

  const startCleaning = () => {
      setStatus('cleaning');
  };

  const finishScan = (threatCount: number) => {
      setStatus('finished');
      
      const newEntry: ScanHistoryItem = {
          id: Date.now(),
          type: scanType || 'Quick Scan',
          date: 'Just now',
          duration: '1m 24s', // Mock duration
          threats: threatCount,
          status: threatCount > 0 ? 'Cleaned' : 'Clean'
      };
      
      setHistory(prev => [newEntry, ...prev.slice(0, 4)]);
  };

  const resetToIdle = () => {
      setStatus('idle');
      setProgress(0);
      setDetectedThreats([]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Scan Center</h2>
        <p className="text-slate-400">Advanced heuristic engine ready for inspection.</p>
      </div>

      {/* SCANNING STATE */}
      {status === 'scanning' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-12 text-center relative overflow-hidden shadow-2xl">
          {detectedThreats.length > 0 && (
             <div className="absolute top-0 left-0 w-full bg-rose-500/10 border-b border-rose-500/20 p-2 text-rose-400 text-sm font-semibold animate-pulse">
                Threats Detected: {detectedThreats.length}
             </div>
          )}
          <div className="relative z-10">
            <div className="w-48 h-48 mx-auto mb-8 relative flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full transition-all duration-300" style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}></div>
              <div className="absolute inset-2 rounded-full border border-emerald-500/30 overflow-hidden">
                  <div className="w-full h-1/2 bg-gradient-to-b from-transparent to-emerald-500/20 animate-scan-line"></div>
              </div>
              <span className="text-4xl font-bold text-white font-mono">{Math.floor(progress)}%</span>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">
                {detectedThreats.length > 0 ? 'Threat detected! Analyzing...' : 'Scanning system files...'}
            </h3>
            <p className="text-slate-400 font-mono text-xs mb-8 truncate max-w-xl mx-auto h-5">
                {currentFile}
            </p>

            <button onClick={stopScan} className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors">
              <Square className="w-4 h-4 fill-current" /> Stop Scan
            </button>
          </div>
        </div>
      )}

      {/* REVIEW THREATS STATE */}
      {status === 'review' && (
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-rose-900/20">
              <div className="bg-rose-500/10 p-6 border-b border-rose-500/20 flex items-center gap-4">
                  <div className="p-3 bg-rose-500 rounded-full animate-pulse">
                      <ShieldAlert className="w-8 h-8 text-white" />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-white">Security Alert</h3>
                      <p className="text-rose-200">{detectedThreats.length} threats found during the scan. Action required.</p>
                  </div>
              </div>
              <div className="p-6">
                  <div className="space-y-3 mb-8 max-h-60 overflow-y-auto custom-scrollbar">
                      {detectedThreats.map(threat => (
                          <div key={threat.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700">
                              <div className="flex items-center gap-4">
                                  <AlertTriangle className="text-rose-500 w-5 h-5" />
                                  <div>
                                      <p className="font-bold text-white">{threat.name}</p>
                                      <p className="text-xs text-slate-400 font-mono">{threat.path}</p>
                                  </div>
                              </div>
                              <span className="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded border border-rose-500/20 uppercase">
                                  {threat.severity}
                              </span>
                          </div>
                      ))}
                  </div>
                  <div className="flex justify-end gap-4">
                      <button onClick={resetToIdle} className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors">
                          Ignore (Not Recommended)
                      </button>
                      <button onClick={startCleaning} className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:scale-105">
                          <Trash2 className="w-5 h-5" /> Clean & Quarantine All
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* CLEANING STATE */}
      {status === 'cleaning' && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-16 text-center">
              <Loader className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Remediating Threats...</h3>
              <p className="text-slate-400">Removing malicious files and repairing registry keys.</p>
          </div>
      )}

      {/* FINISHED / SAFE STATE */}
      {status === 'finished' && (
          <div className="bg-slate-800 rounded-2xl border border-emerald-500/30 p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                  <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">System is Secure</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  {detectedThreats.length > 0 
                    ? `Successfully neutralized ${detectedThreats.length} threats. Your endpoint is now safe.` 
                    : 'No threats were found during the scan. Your system is clean.'}
              </p>
              <button onClick={resetToIdle} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
                  Return to Dashboard
              </button>
          </div>
      )}

      {/* IDLE STATE - OPTIONS */}
      {status === 'idle' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScanOption 
            title="Quick Scan" 
            desc="Scans critical system areas, active processes, and startup files for active threats." 
            icon={<FileCheck className="w-8 h-8 text-blue-400" />}
            onStart={() => startScan(ScanType.QUICK)}
          />
          <ScanOption 
            title="Full System Scan" 
            desc="Deep inspection of all local drives, external storage, and registry hives." 
            icon={<HardDrive className="w-8 h-8 text-emerald-400" />}
            onStart={() => startScan(ScanType.FULL)}
          />
          <ScanOption 
            title="Custom Scan" 
            desc="Select specific directories or network locations to analyze." 
            icon={<FolderSearch className="w-8 h-8 text-purple-400" />}
            onStart={() => startScan(ScanType.CUSTOM)}
          />
        </div>
      )}

      {/* RECENT HISTORY - Always visible unless scanning */}
      {status === 'idle' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" /> Recent Activity
            </h4>
            <div className="space-y-3">
                {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${item.status === 'Cleaned' ? 'bg-emerald-500' : item.status === 'Infected' ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                            <div>
                                <p className="text-sm font-medium text-slate-200">{item.type}</p>
                                <p className="text-xs text-slate-500">{item.date} • Duration: {item.duration}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {item.threats > 0 && (
                                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded">
                                    {item.threats} Threats
                                </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded border ${
                                item.status === 'Cleaned' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                item.status === 'Infected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                                'bg-slate-700 text-slate-300 border-slate-600'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

const ScanOption: React.FC<{ title: string, desc: string, icon: React.ReactNode, onStart: () => void }> = ({ title, desc, icon, onStart }) => (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group relative overflow-hidden" onClick={onStart}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            {icon}
        </div>
        <div className="mb-4 p-3 bg-slate-900 w-fit rounded-lg group-hover:scale-110 transition-transform relative z-10 border border-slate-800">{icon}</div>
        <h3 className="text-lg font-bold text-white mb-2 relative z-10">{title}</h3>
        <p className="text-sm text-slate-400 mb-6 min-h-[40px] relative z-10">{desc}</p>
        <button className="w-full py-2 bg-slate-700 group-hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 relative z-10">
            <Play className="w-4 h-4 fill-current" /> Start Scan
        </button>
    </div>
);
