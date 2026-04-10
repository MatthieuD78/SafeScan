import React from 'react';

export const AnalyzingSpinner: React.FC = () => (
  <div className="py-12 flex flex-col items-center gap-4 animate-in fade-in">
    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    <p className="font-bold text-slate-400">Intelligence SafeScan en cours...</p>
  </div>
);
