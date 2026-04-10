
export interface RecallAlert {
  id: string;
  name: string;
  brand: string;
  lot?: string;
  reason: string;
  date: string;
}

export interface AlerteSanitaire {
  produit: string;
  marque: string;
  lot_detecte: string;
  statut: 'CRITIQUE' | 'AUCUN';
  motif: string;
  procedure_remboursement: string;
}

export interface FridgeItem {
  article: string;
  conso_avant: string;
  conseil: string;
  valeur_estimee: string;
}

export interface OptionFaitMaison {
  recette: string;
  recette_complete: string;
  economie_estimee: string;
}

export interface OptimisationSante {
  produit_analyse: string;
  alerte_ingredient: string;
  alternative_magasin: string;
  option_fait_maison: OptionFaitMaison;
}

export interface EconomieDetail {
  source: string;
  montant: string;
}

export interface SafeScanResponse {
  alerte_sanitaire: AlerteSanitaire;
  gestion_frigo: FridgeItem[];
  optimisation_sante: OptimisationSante;
  bilan_economique: string;
  details_economies: EconomieDetail[];
}

export interface AppSettings {
  detectSugars: boolean;
  autoSyncBank: boolean;
  subscriptionActive: boolean;
}

export interface ConnectedService {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  type: 'bank' | 'loyalty' | 'nfc';
}
