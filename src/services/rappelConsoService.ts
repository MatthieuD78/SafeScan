import { RappelConsoOfficial, RappelConsoApiResponse, RecallMatch } from '../types/rappelconso';

const API_BASE_URL = 'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso0';

export class RappelConsoService {
  private lastFetch: Date | null = null;
  private cache: RappelConsoOfficial[] = [];
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Récupère les derniers rappels (API officielle)
  async fetchLatestRecalls(limit: number = 50): Promise<RappelConsoOfficial[]> {
    // Utilise le cache si récent
    if (this.cache.length > 0 && this.lastFetch && 
        (Date.now() - this.lastFetch.getTime()) < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      const url = `${API_BASE_URL}/records?limit=${limit}&order_by=date_publication DESC`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: RappelConsoApiResponse = await response.json();
      
      // Filtre uniquement les produits alimentaires
      const foodRecalls = data.results.filter(r => 
        r.categorie?.toLowerCase().includes('aliment') ||
        r.sous_categorie?.toLowerCase().includes('lait') ||
        r.sous_categorie?.toLowerCase().includes('viande') ||
        r.sous_categorie?.toLowerCase().includes('poisson') ||
        r.sous_categorie?.toLowerCase().includes('fromage')
      );

      this.cache = foodRecalls;
      this.lastFetch = new Date();

      return foodRecalls;
    } catch (error) {
      console.error('RappelConso API Error:', error);
      // Fallback sur le cache même périmé
      return this.cache;
    }
  }

  // Recherche fuzzy d'un produit dans les rappels
  async checkProduct(
    productName: string, 
    brand?: string, 
    lot?: string
  ): Promise<RecallMatch[]> {
    const recalls = await this.fetchLatestRecalls(100);
    const matches: RecallMatch[] = [];

    const searchName = this.normalize(productName);
    const searchBrand = brand ? this.normalize(brand) : '';

    for (const rappel of recalls) {
      let confidence = 0;
      let matchedOn: RecallMatch['matchedOn'] = 'name';
      let severity: RecallMatch['severity'] = 'INFO';

      // Match par nom de produit
      const rappelNames = [
        this.normalize(rappel.noms_commerciaux),
        this.normalize(rappel.identification_produits)
      ];
      
      for (const rappelName of rappelNames) {
        if (rappelName.includes(searchName) || searchName.includes(rappelName)) {
          confidence += 40;
        }
      }

      // Match par marque
      if (searchBrand && this.normalize(rappel.nom_marque).includes(searchBrand)) {
        confidence += 30;
        matchedOn = 'brand';
      }

      // Match par lot (CRITIQUE)
      if (lot && rappel.modeles_references) {
        const rappelLots = rappel.modeles_references.toLowerCase().split(/[,;/]+/);
        if (rappelLots.some(l => l.trim() === lot.toLowerCase())) {
          confidence = 100;
          matchedOn = 'lot';
          severity = 'CRITICAL';
        }
      }

      // Détermine la sévérité selon les risques
      if (severity !== 'CRITICAL') {
        const risks = rappel.risques?.toLowerCase() || '';
        if (risks.includes('listeria') || risks.includes('salmonella') || 
            risks.includes('e.coli') || risks.includes('stec')) {
          severity = 'CRITICAL';
          confidence = Math.max(confidence, 70);
        } else if (risks.includes('corps étranger') || risks.includes('allergène')) {
          severity = 'WARNING';
        }
      }

      // Ajoute le match si confiance suffisante
      if (confidence >= 40) {
        matches.push({
          rappel,
          productName,
          confidence: Math.min(confidence, 100),
          matchedOn,
          severity
        });
      }
    }

    // Trie par confiance décroissante
    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  // Normalise le texte pour comparaison
  private normalize(text: string): string {
    return text
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlève accents
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || '';
  }

  // Force le refresh du cache
  async forceRefresh(): Promise<RappelConsoOfficial[]> {
    this.lastFetch = null;
    this.cache = [];
    return this.fetchLatestRecalls(50);
  }

  // Recherche par texte libre
  async searchRecalls(query: string, limit: number = 20): Promise<RappelConsoOfficial[]> {
    const recalls = await this.fetchLatestRecalls(200);
    const search = this.normalize(query);

    return recalls
      .filter(r => {
        const text = `${r.noms_commerciaux} ${r.nom_marque} ${r.motif_rappel}`.toLowerCase();
        return text.includes(search);
      })
      .slice(0, limit);
  }
}
