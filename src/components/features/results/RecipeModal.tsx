import React from 'react';
import { XCircle, ChefHat, PiggyBank, Timer, ArrowRight, ShieldCheck } from 'lucide-react';
import { OptionFaitMaison } from '../../../types';

interface RecipeModalProps {
  recipe: OptionFaitMaison | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, isOpen, onClose }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20">
        {/* Header */}
        <div className="p-8 pb-4 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2.5 rounded-2xl text-emerald-600">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 leading-tight">Recette Fait-Maison</h3>
          </div>
          
          <p className="text-lg font-bold text-slate-500 italic mb-2">"{recipe.recette}"</p>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
              <PiggyBank className="w-3.5 h-3.5" /> Économie: {recipe.economie_estimee}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm">
              <Timer className="w-3.5 h-3.5" /> Rapide & Sain
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors shadow-sm active:scale-90"
          >
            <XCircle className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-6">
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
            {recipe.recette_complete}
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-700 transition-all">
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Prêt à essayer ?</p>
              <p className="font-bold">Ajouter les ingrédients manquants</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Recommandation locale SafeScan
          </p>
        </div>
      </div>
    </div>
  );
};
