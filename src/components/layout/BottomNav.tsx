import React from 'react';
import { Search, Bell, Wallet } from 'lucide-react';
import { TabType } from '../../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'scan', icon: <Search className="w-6 h-6" />, label: 'Scan' },
    { id: 'alerts', icon: <Bell className="w-6 h-6" />, label: 'Alertes' },
    { id: 'services', icon: <Wallet className="w-6 h-6" />, label: 'Portefeuille' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 flex justify-around items-center z-50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id ? 'text-indigo-600 scale-110' : 'text-slate-400'
          }`}
        >
          {tab.icon}
          <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
