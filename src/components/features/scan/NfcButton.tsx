import React from 'react';
import { Rss, RefreshCcw, Camera } from 'lucide-react';

interface NfcButtonProps {
  isScanning: boolean;
  onScan: () => void;
}

export const NfcButton: React.FC<NfcButtonProps> = ({ isScanning, onScan }) => (
  <div className="grid grid-cols-2 gap-3">
    <button
      onClick={onScan}
      disabled={isScanning}
      className="relative flex flex-col items-center gap-3 p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 overflow-hidden"
    >
      <Rss className={`w-8 h-8 ${isScanning ? 'animate-pulse' : ''}`} />
      <span className="font-bold text-sm">Payer & Scanner</span>
      {isScanning && (
        <div className="absolute inset-0 bg-indigo-700/80 flex items-center justify-center animate-in fade-in">
          <RefreshCcw className="animate-spin w-6 h-6" />
        </div>
      )}
    </button>
    
    <button className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-200 rounded-3xl text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
      <Camera className="w-8 h-8 text-slate-400" />
      <span className="font-bold text-sm">Photo Ticket</span>
    </button>
  </div>
);
