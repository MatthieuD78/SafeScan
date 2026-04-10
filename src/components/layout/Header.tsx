import React from 'react';
import { ShieldCheck, Lock, Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => (
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
    <div className="max-w-3xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">SafeScan</h1>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
            <Lock className="w-2.5 h-2.5" /> Sécurité Chiffrée
          </div>
        </div>
      </div>
      <button 
        onClick={onSettingsClick} 
        className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  </header>
);
