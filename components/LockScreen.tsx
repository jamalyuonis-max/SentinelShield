import React, { useState } from 'react';
import { Lock, ChevronRight, ShieldCheck } from 'lucide-react';

interface LockScreenProps {
    onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock PIN validation - accept '1234' or any 4 digit pin for demo purposes if empty
        if (pin === '1234' || pin.length === 4) {
            onUnlock();
        } else {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <ShieldCheck className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Sentinel<span className="text-emerald-500">Shield</span></h1>
                    <p className="text-slate-400">Endpoint Protection Platform</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 ring-2 ring-slate-700">
                            <Lock className="w-6 h-6 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-medium text-white">Console Locked</h2>
                        <p className="text-sm text-slate-500">Enter your PIN to access the dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className={`w-full bg-slate-950 border ${error ? 'border-rose-500 text-rose-500' : 'border-slate-700 text-white focus:border-emerald-500'} rounded-lg py-3 px-4 text-center text-2xl tracking-widest outline-none transition-all placeholder:text-slate-800`}
                                placeholder="••••"
                                maxLength={4}
                                autoFocus
                            />
                        </div>
                        
                        <button 
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group"
                        >
                            Unlock Console
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                    
                    {error && (
                        <p className="text-rose-500 text-xs text-center mt-4 animate-pulse">
                            Incorrect PIN. Please try again.
                        </p>
                    )}
                </div>
                
                <p className="text-center text-slate-600 text-xs mt-8">
                    Protected by SentinelShield Integrity Guard &copy; 2024
                </p>
            </div>
        </div>
    );
};
