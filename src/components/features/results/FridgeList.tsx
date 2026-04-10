import React from 'react';
import { FridgeItem } from '../../../types';

interface FridgeListProps {
  items: FridgeItem[];
}

export const FridgeList: React.FC<FridgeListProps> = ({ items }) => (
  <div className="grid gap-3">
    {items.map((item, idx) => (
      <div 
        key={idx} 
        className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between"
      >
        <div>
          <p className="font-bold text-slate-800">{item.article}</p>
          <p className="text-xs text-slate-500">{item.conseil}</p>
        </div>
        <div className="text-right">
          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black block mb-1">
            {item.conso_avant}
          </span>
          <span className="text-[10px] font-bold text-emerald-600">
            Valeur: {item.valeur_estimee}
          </span>
        </div>
      </div>
    ))}
  </div>
);
