import React from 'react';
import { MENU_ITEMS } from '../constants';
import { View } from '../types';
import { ShieldCheck, LogOut, Lock } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLock: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLock }) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">Sentinel<span className="text-emerald-500">Shield</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as View)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
         <button 
            onClick={onLock}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors mb-2"
         >
            <Lock className="w-5 h-5" />
            <span className="font-medium">Lock Console</span>
         </button>
         
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">AGENT STATUS</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <p className="text-sm font-medium text-white">v4.2.0 (Stable)</p>
          <p className="text-xs text-slate-500 mt-1">Definitions: Up to date</p>
        </div>
      </div>
    </div>
  );
};
