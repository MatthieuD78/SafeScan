import React from 'react';
import { Bell, ArrowDownWideNarrow } from 'lucide-react';
import { RecallAlert } from '../../../types';

interface RecallListProps {
  recalls: RecallAlert[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const RecallList: React.FC<RecallListProps> = ({ 
  recalls, 
  searchTerm, 
  onSearchChange 
}) => {
  if (recalls.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 font-bold italic">
        Aucun rappel correspondant à votre recherche.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3 shadow-sm">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher une marque ou un produit..."
          className="bg-transparent border-none outline-none w-full text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Base RappelConso Officielle
        </h3>
        <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
          <ArrowDownWideNarrow className="w-3 h-3" /> Tri: Récent
        </div>
      </div>

      {recalls.map(recall => (
        <div 
          key={recall.id} 
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-amber-200 transition-colors"
        >
          <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
            <Bell className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-slate-800 leading-tight">{recall.name}</h4>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold whitespace-nowrap ml-2">
                {recall.date}
              </span>
            </div>
            <p className="text-xs text-indigo-600 font-bold mb-2">{recall.brand}</p>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">{recall.reason}</p>
            {recall.lot && (
              <span className="text-[10px] font-mono bg-slate-100 p-1 px-2 rounded border border-slate-200 font-bold">
                LOT: {recall.lot}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
