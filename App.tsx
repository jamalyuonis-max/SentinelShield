import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ScanCenter } from './components/ScanCenter';
import { Quarantine } from './components/Quarantine';
import { Intelligence } from './components/Intelligence';
import { Settings } from './components/Settings';
import { LockScreen } from './components/LockScreen';
import { INITIAL_STATS } from './constants';
import { View } from './types';
import { Bell } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isLocked, setIsLocked] = useState(true);
  
  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard stats={INITIAL_STATS} />;
      case View.SCAN:
        return <ScanCenter />;
      case View.THREATS:
        return <Quarantine />;
      case View.INTELLIGENCE:
        return <Intelligence />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard stats={INITIAL_STATS} />;
    }
  };

  if (isLocked) {
      return <LockScreen onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onLock={() => setIsLocked(true)}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-white capitalize">{currentView.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 border-2 border-slate-800 ring-2 ring-slate-800/50"></div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
