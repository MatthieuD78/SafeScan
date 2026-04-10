// Types officiels API RappelConso (data.gouv.fr)

export interface RappelConsoOfficial {
  id: string;
  reference_fiche: string;
  nature_juridique: string;
  categorie: string;
  sous_categorie?: string;
  nom_marque: string;
  noms_commerciaux: string;
  modeles_references: string; // Numéros de lot
  identification_produits: string;
  motif_rappel: string;
  risques: string;
  date_publication: string;
  date_fin_rappel?: string;
  lien_fiche: string;
  images?: string[];
  distributeurs?: string[];
  zone_geographique?: string;
  conduites_tenir?: string;
  personnes_a_risque?: string;
}

export interface RappelConsoApiResponse {
  total_count: number;
  results: RappelConsoOfficial[];
}

// Match entre un produit scanné et un rappel
export interface RecallMatch {
  rappel: RappelConsoOfficial;
  productName: string;
  confidence: number; // 0-100, fuzzy match score
  matchedOn: 'name' | 'lot' | 'brand' | 'combined';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}

// Alerte active pour l'utilisateur
export interface ActiveRecallAlert {
  id: string;
  match: RecallMatch;
  detectedAt: string;
  dismissed: boolean;
  actionTaken?: 'viewed' | 'contacted' | 'returned';
}
