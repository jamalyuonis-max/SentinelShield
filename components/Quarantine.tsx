import React, { useState, useMemo } from 'react';
import { MOCK_THREATS } from '../constants';
import { Threat, ThreatStatus, ThreatSeverity } from '../types';
import { Trash2, RotateCcw, Search, AlertOctagon, Cpu, X, CheckCircle, ShieldOff } from 'lucide-react';
import { analyzeThreatWithGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const Quarantine: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>(MOCK_THREATS);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Efficiently filter threats based on search query
  const filteredThreats = useMemo(() => {
    if (!searchQuery.trim()) return threats;
    const lowerQuery = searchQuery.toLowerCase();
    return threats.filter(t => 
        t.name.toLowerCase().includes(lowerQuery) || 
        t.type.toLowerCase().includes(lowerQuery) ||
        t.path.toLowerCase().includes(lowerQuery)
    );
  }, [threats, searchQuery]);

  const handleAction = (id: string, action: 'delete' | 'restore') => {
    setThreats(prev => prev.map(t => {
        if (t.id === id) {
            return { ...t, status: action === 'delete' ? ThreatStatus.RESOLVED : ThreatStatus.ACTIVE };
        }
        return t;
    }));
  };

  const handleAnalyze = async (threat: Threat) => {
    setSelectedThreat(threat);
    setAnalyzing(true);
    const analysisResult = await analyzeThreatWithGemini(threat);
    setThreats(prev => prev.map(t => t.id === threat.id ? { ...t, analysis: analysisResult } : t));
    setAnalyzing(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-white">Threat Management</h2>
            <p className="text-slate-400">Manage detected threats, quarantine, and analyze suspicious files.</p>
        </div>
        <div className="flex gap-2">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search threats..." 
                    className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-64 transition-all focus:w-80"
                />
             </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-800 border border-slate-700 rounded-xl custom-scrollbar relative">
        {filteredThreats.length > 0 ? (
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/50 sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Threat Name</th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Severity</th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Detected</th>
                        <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {filteredThreats.map((threat) => (
                        <tr key={threat.id} className="hover:bg-slate-700/30 transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-500/10 rounded text-rose-500 group-hover:scale-110 transition-transform">
                                        <AlertOctagon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{threat.name}</p>
                                        <p className="text-xs text-slate-500 font-mono truncate max-w-[200px]" title={threat.path}>{threat.path}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                                    threat.severity === ThreatSeverity.CRITICAL ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                                    threat.severity === ThreatSeverity.HIGH ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                }`}>
                                    {threat.severity}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className={`text-sm ${
                                    threat.status === ThreatStatus.RESOLVED ? 'text-emerald-400' : 
                                    threat.status === ThreatStatus.QUARANTINED ? 'text-amber-400' : 'text-rose-400'
                                }`}>{threat.status}</span>
                            </td>
                            <td className="p-4 text-sm text-slate-400">
                                {new Date(threat.detectedAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleAnalyze(threat)}
                                        className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors tooltip"
                                        title="Analyze with AI"
                                    >
                                        <Cpu className="w-4 h-4" />
                                    </button>
                                    {threat.status !== ThreatStatus.RESOLVED && (
                                        <>
                                            <button 
                                                onClick={() => handleAction(threat.id, 'restore')}
                                                className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                title="Restore"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(threat.id, 'delete')}
                                                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                title="Delete Forever"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <ShieldOff className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-lg font-medium">No threats found</p>
                <p className="text-sm">No items match your search criteria.</p>
            </div>
        )}
      </div>

      {/* AI Analysis Modal */}
      {selectedThreat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <Cpu className="w-6 h-6 text-purple-400" />
                          <h3 className="text-xl font-bold text-white">AI Threat Analysis</h3>
                      </div>
                      <button onClick={() => setSelectedThreat(null)} className="text-slate-400 hover:text-white transition-colors">
                          <X className="w-6 h-6" />
                      </button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                      <div className="mb-6 bg-slate-800 p-4 rounded-lg border border-slate-700/50">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Target Object</p>
                          <p className="font-mono text-emerald-400 break-all text-sm">{selectedThreat.name}</p>
                          <p className="font-mono text-slate-500 break-all text-xs mt-1">{selectedThreat.hash}</p>
                      </div>
                      
                      {analyzing ? (
                          <div className="flex flex-col items-center justify-center py-12">
                              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                              <p className="text-purple-300 animate-pulse font-medium">Consulting Neural Cloud...</p>
                          </div>
                      ) : selectedThreat.analysis ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                              <ReactMarkdown>{selectedThreat.analysis}</ReactMarkdown>
                          </div>
                      ) : (
                          <div className="text-center py-8 text-slate-500">
                              No analysis data available.
                          </div>
                      )}
                  </div>
                  <div className="p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl flex justify-end gap-3">
                      <button onClick={() => setSelectedThreat(null)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Close</button>
                      <button 
                        onClick={() => setSelectedThreat(null)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-purple-600/20"
                      >
                          <CheckCircle className="w-4 h-4" /> Apply Recommended Action
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};