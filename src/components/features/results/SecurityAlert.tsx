import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AlerteSanitaire } from '../../../types';

interface SecurityAlertProps {
  alert: AlerteSanitaire;
}

export const SecurityAlert: React.FC<SecurityAlertProps> = ({ alert }) => {
  if (alert.statut === 'CRITIQUE') {
    return (
      <div className="bg-white border-2 border-red-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-red-500 text-white p-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 animate-bounce" />
          <div>
            <p className="font-bold">ALERTE CRITIQUE : {alert.produit}</p>
            <p className="text-xs opacity-90">Lot {alert.lot_detecte} identifié</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600">{alert.motif}</p>
          <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-100">
            Générer le dossier de remboursement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 text-emerald-600">
      <CheckCircle2 className="w-6 h-6" />
      <p className="text-sm font-bold">Aucun risque immédiat identifié.</p>
    </div>
  );
};
