import React from 'react';
import { ChevronRight, PiggyBank, TrendingUp } from 'lucide-react';
import { EconomieDetail } from '../../../types';

interface BilanCardProps {
  totalEconomy: string;
  details: EconomieDetail[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const BilanCard: React.FC<BilanCardProps> = ({
  totalEconomy,
  details,
  isExpanded,
  onToggle
}) => (
  <div className="space-y-3">
    {/* Main Card */}
    <div
      onClick={onToggle}
      className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-100 flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform"
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-2xl">
          <PiggyBank className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-sm font-bold opacity-80">Bilan d'optimisation</h3>
          <p className="text-2xl font-black">+{totalEconomy}</p>
        </div>
      </div>
      <ChevronRight className={isExpanded ? 'rotate-90 transition-transform' : 'transition-transform'} />
    </div>

    {/* Expanded Details */}
    {isExpanded && (
      <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 animate-in slide-in-from-top-2">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" /> Détail du gain
        </h4>
        {details.map((detail, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
            <span className="text-sm font-bold text-slate-600">{detail.source}</span>
            <span className="text-sm font-black text-emerald-600">{detail.montant}</span>
          </div>
        ))}
        <p className="text-[10px] text-slate-400 italic px-1">
          * Ce montant représente les économies réalisées via l'anti-gaspillage, les remboursments et les alternatives DIY.
        </p>
      </div>
    )}
  </div>
);
