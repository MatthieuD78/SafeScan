import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { OptimisationSante, OptionFaitMaison } from '../../../types';

interface NutritionCoachProps {
  data: OptimisationSante;
  onRecipeClick: (recipe: OptionFaitMaison) => void;
}

export const NutritionCoach: React.FC<NutritionCoachProps> = ({ data, onRecipeClick }) => (
  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="p-4 bg-amber-50/50 border-b border-slate-100">
      <h5 className="font-bold text-amber-800">{data.produit_analyse}</h5>
      <p className="text-xs text-amber-600 font-bold">{data.alerte_ingredient}</p>
    </div>
    
    <div className="p-5 space-y-4">
      {/* Store Alternative */}
      <div className="flex gap-4 items-center">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0 font-bold text-xs shadow-sm">
          M
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            Option magasin plus saine
          </p>
          <p className="text-sm font-bold text-slate-800">{data.alternative_magasin}</p>
        </div>
      </div>

      {/* DIY Recipe Card */}
      <div
        onClick={() => onRecipeClick(data.option_fait_maison)}
        className="flex gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer group active:scale-95"
      >
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shrink-0 font-bold text-xs shadow-md group-hover:scale-110 transition-transform">
          DIY
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Recette Minute</p>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-sm text-slate-700 italic font-medium mb-2 leading-snug">
            "{data.option_fait_maison.recette}"
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-emerald-700 bg-white/50 px-2 py-0.5 rounded-lg border border-emerald-100 shadow-sm">
              Économie : {data.option_fait_maison.economie_estimee}
            </p>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              Voir la recette <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
