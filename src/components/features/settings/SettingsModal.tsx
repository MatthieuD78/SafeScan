import React from 'react';
import { XCircle, Sparkles, Leaf, ShieldCheck } from 'lucide-react';
import { AppSettings } from '../../../types';
import { Modal } from '../../ui/Modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onToggleSetting: (key: keyof AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onToggleSetting
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Réglages">
    <div className="space-y-4">
      {/* Subscription Status */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-700">Abonnement Anti-Gaspi</span>
        </div>
        <span className="text-emerald-600 font-black text-xs uppercase bg-white px-2 py-1 rounded-lg border border-emerald-100 shadow-sm">
          ACTIF
        </span>
      </div>

      {/* Sugar Detection Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-700">Analyse Sucre/Additifs</span>
        </div>
        <input
          type="checkbox"
          checked={settings.detectSugars}
          onChange={() => onToggleSetting('detectSugars')}
          className="w-5 h-5 accent-indigo-600 rounded"
        />
      </div>

      {/* RGPD Notice */}
      <div className="p-4 bg-indigo-50/50 rounded-2xl text-[11px] text-indigo-800 leading-relaxed border border-indigo-100">
        <strong>POLITIQUE RGPD :</strong> Vos données bancaires sont chiffrées de bout en bout. 
        SafeScan utilise l'intelligence artificielle Gemini pour analyser vos tickets sans 
        jamais stocker votre identité réelle sur ses serveurs de traitement.
      </div>
    </div>
  </Modal>
);
