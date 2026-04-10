import { GoogleGenAI, Type } from "@google/genai";
import { SafeScanResponse, RecallAlert, AppSettings } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeReceipt(
    receiptText: string, 
    recalls: RecallAlert[], 
    settings: AppSettings
  ): Promise<SafeScanResponse> {
    const model = 'gemini-3-flash-preview';
    
    const systemInstruction = `
      Tu es l'intelligence centrale de "SafeScan".
      
      MISSIONS :
      1. SÉCURITÉ : Compare avec la base RappelConso. Si lot match -> CRITIQUE.
      2. ANTI-GASPILLAGE : Estime la durée de vie des produits frais et leur VALEUR MONÉTAIRE (ex: 3.50€).
      3. COACH NUTRITION : Détecte les ultra-transformés. Propose alternative ET recette maison avec économie précise.

      DÉTAILS ÉCONOMIQUES :
      Tu dois décomposer le "bilan_economique" en plusieurs sources dans "details_economies".
      
      CONSIGNE RECETTE :
      Le champ "recette_complete" doit contenir une recette structurée (Ingrédients, Étapes) au format Markdown pour être lisible. Sois précis et encourageant.
    `;

    const prompt = `
      DONNÉES DU TICKET :
      ${receiptText}

      FLUX DE RAPPELS :
      ${JSON.stringify(recalls)}
    `;

    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              alerte_sanitaire: {
                type: Type.OBJECT,
                properties: {
                  produit: { type: Type.STRING },
                  marque: { type: Type.STRING },
                  lot_detecte: { type: Type.STRING },
                  statut: { type: Type.STRING },
                  motif: { type: Type.STRING },
                  procedure_remboursement: { type: Type.STRING }
                },
                required: ["produit", "marque", "lot_detecte", "statut", "motif", "procedure_remboursement"]
              },
              gestion_frigo: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    article: { type: Type.STRING },
                    conso_avant: { type: Type.STRING },
                    conseil: { type: Type.STRING },
                    valeur_estimee: { type: Type.STRING }
                  },
                  required: ["article", "conso_avant", "conseil", "valeur_estimee"]
                }
              },
              optimisation_sante: {
                type: Type.OBJECT,
                properties: {
                  produit_analyse: { type: Type.STRING },
                  alerte_ingredient: { type: Type.STRING },
                  alternative_magasin: { type: Type.STRING },
                  option_fait_maison: {
                    type: Type.OBJECT,
                    properties: {
                      recette: { type: Type.STRING },
                      recette_complete: { type: Type.STRING },
                      economie_estimee: { type: Type.STRING }
                    },
                    required: ["recette", "recette_complete", "economie_estimee"]
                  }
                },
                required: ["produit_analyse", "alerte_ingredient", "alternative_magasin", "option_fait_maison"]
              },
              details_economies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    montant: { type: Type.STRING }
                  },
                  required: ["source", "montant"]
                }
              },
              bilan_economique: { type: Type.STRING }
            },
            required: ["alerte_sanitaire", "gestion_frigo", "optimisation_sante", "details_economies", "bilan_economique"]
          }
        }
      });

      return JSON.parse(response.text || '{}') as SafeScanResponse;
    } catch (error) {
      console.error("Analysis Error:", error);
      throw error;
    }
  }
}
