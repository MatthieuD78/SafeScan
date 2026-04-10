import React from 'react';
import { AlertTriangle, X, ExternalLink, RefreshCw } from 'lucide-react';
import { ActiveRecallAlert, RecallMatch } from '../../../types/rappelconso';
import { Button } from '../../ui/Button';

interface RealTimeRecallBannerProps {
  alerts: ActiveRecallAlert[];
  onDismiss: (alertId: string) => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
  isLoading: boolean;
}

export const RealTimeRecallBanner: React.FC<RealTimeRecallBannerProps> = ({
  alerts,
  onDismiss,
  onRefresh,
  lastUpdated,
  isLoading
}) => {
  // Filtre uniquement les alertes non dismissées
  const activeAlerts = alerts.filter(a => !a.dismissed);
  
  // Sépare critiques et warnings
  const criticalAlerts = activeAlerts.filter(a => a.match.severity === 'CRITICAL');
  const warningAlerts = activeAlerts.filter(a => a.match.severity === 'WARNING');

  if (activeAlerts.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-emerald-800">
            Aucun rappel sanitaire détecté dans vos courses
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 hover:bg-emerald-100 rounded-full transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header avec stats */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="font-bold text-slate-800">
            {criticalAlerts.length > 0 ? (
              <span className="text-red-600">
                {criticalAlerts.length} alerte{criticalAlerts.length > 1 ? 's' : ''} critique{criticalAlerts.length > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-amber-600">
                {warningAlerts.length} attention{warningAlerts.length > 1 ? 's' : ''}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-slate-400">
              Mis à jour {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Alertes critiques */}
      {criticalAlerts.map(alert => (
        <CriticalAlertCard key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}

      {/* Alertes warnings */}
      {warningAlerts.map(alert => (
        <WarningAlertCard key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// Carte alerte CRITIQUE
const CriticalAlertCard: React.FC<{ 
  alert: ActiveRecallAlert; 
  onDismiss: (id: string) => void;
}> = ({ alert, onDismiss }) => {
  const { rappel, productName, confidence, matchedOn } = alert.match;

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-2xl overflow-hidden shadow-lg shadow-red-100 animate-in slide-in-from-top">
      {/* Header rouge */}
      <div className="bg-red-500 text-white p-4 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 animate-pulse shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-bold text-lg leading-tight">
            PRODUIT RAPPELÉ DÉTECTÉ
          </p>
          <p className="text-sm opacity-90 mt-1">
            "{productName}" correspond à un rappel officiel
          </p>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          className="p-1 hover:bg-red-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-3">
        {/* Détails du rappel */}
        <div className="bg-white rounded-xl p-3 border border-red-100">
          <h4 className="font-bold text-red-800">{rappel.noms_commerciaux}</h4>
          <p className="text-sm text-slate-600 mt-1">
            <span className="font-medium">Marque:</span> {rappel.nom_marque}
          </p>
          {rappel.modeles_references && (
            <p className="text-sm text-slate-600">
              <span className="font-medium">Lot(s):</span> {rappel.modeles_references}
            </p>
          )}
        </div>

        {/* Risques */}
        <div className="bg-red-100 rounded-xl p-3">
          <p className="text-sm font-bold text-red-800">Risques identifiés:</p>
          <p className="text-sm text-red-700 mt-1">{rappel.risques}</p>
        </div>

        {/* Motif */}
        <p className="text-sm text-slate-700">{rappel.motif_rappel}</p>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="danger"
            size="sm"
            fullWidth
            onClick={() => window.open(rappel.lien_fiche, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            Voir la fiche officielle
          </Button>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-red-100">
          <span>Confiance: {confidence}% ({matchedOn})</span>
          <span>Publié le {new Date(rappel.date_publication).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

// Carte alerte WARNING
const WarningAlertCard: React.FC<{ 
  alert: ActiveRecallAlert; 
  onDismiss: (id: string) => void;
}> = ({ alert, onDismiss }) => {
  const { rappel, productName, confidence } = alert.match;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-amber-800">
            Vérifier: "{productName}"
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Possible correspondance avec: {rappel.noms_commerciaux}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {rappel.motif_rappel.substring(0, 100)}...
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onDismiss(alert.id)}
            className="p-1 hover:bg-amber-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-amber-600" />
          </button>
          <button
            onClick={() => window.open(rappel.lien_fiche, '_blank')}
            className="p-1 hover:bg-amber-200 rounded-full transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
