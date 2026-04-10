import { GoogleGenAI } from '@google/genai';
import { 
  NutritionProfile, 
  WeeklyAnalysis, 
  NutritionRecommendation,
  ProductNutritionInfo 
} from '../types/nutrition';
import { FridgeItem } from '../types';

export class NutritionService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeWeeklyBasket(
    items: FridgeItem[],
    profile: NutritionProfile
  ): Promise<{ analysis: WeeklyAnalysis; recommendations: NutritionRecommendation[] }> {
    const model = 'gemini-1.5-flash';

    const systemInstruction = `
      Tu es un nutritionniste expert français spécialisé dans l'analyse des habitudes alimentaires.
      
      RÈGLES:
      - Base-toi sur les guides alimentaires français (PNNS)
      - Privilégie les produits peu transformés (NOVA 1-2)
      - Identifie les excès de sucres ajoutés, sel, gras saturés
      - Suggère des alternatives réalistes et accessibles
      
      FORMAT JSON STRICT requis avec:
      - overallScore: 0-100
      - macroSplit: {carbs, proteins, fats} en pourcentages
      - nutriScoreAverage: A/B/C/D/E
      - warnings: tableau avec type, severity, message
      - recommendations: tableau priorisé
    `;

    const prompt = `
      PROFIL UTILISATEUR:
      Objectifs: ${profile.goals.join(', ')}
      Restrictions: ${profile.restrictions.join(', ') || 'Aucune'}
      Allergies: ${profile.allergies.join(', ') || 'Aucune'}
      Budget: ${profile.budget}
      
      PANIER DE COURSES:
      ${JSON.stringify(items.map(i => i.article))}
      
      Analyse nutritionnelle détaillée requise.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      const result = JSON.parse(response.text || '{}');

      const analysis: WeeklyAnalysis = {
        weekNumber: this.getWeekNumber(new Date()),
        year: new Date().getFullYear(),
        overallScore: result.overallScore || 50,
        macroSplit: result.macroSplit || { carbs: 50, proteins: 20, fats: 30 },
        nutriScoreAverage: result.nutriScoreAverage || 'C',
        warnings: result.warnings || [],
        achievements: result.achievements || [],
        analyzedAt: new Date().toISOString()
      };

      const recommendations: NutritionRecommendation[] = (result.recommendations || []).map(
        (rec: any, idx: number) => ({
          id: `rec-${Date.now()}-${idx}`,
          type: rec.type || 'alternative',
          priority: rec.priority || 'medium',
          title: rec.title,
          description: rec.description,
          impact: rec.impact,
          currentProduct: rec.currentProduct,
          suggestedProduct: rec.suggestedProduct,
          estimatedSavings: rec.estimatedSavings,
          products: rec.products,
          createdAt: new Date().toISOString()
        })
      );

      return { analysis, recommendations };
    } catch (error) {
      console.error('Nutrition Analysis Error:', error);
      throw new Error('Échec de l\'analyse nutritionnelle');
    }
  }

  // Récupère infos nutrition via OpenFoodFacts
  async getProductInfo(barcode: string): Promise<ProductNutritionInfo | null> {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();

      if (data.status !== 1) return null;

      const product = data.product;
      return {
        barcode,
        name: product.product_name || 'Unknown',
        brand: product.brands,
        nutriScore: product.nutriscore_grade?.toUpperCase(),
        novaGroup: product.nova_group,
        macros: {
          carbs: product.nutriments?.carbohydrates_100g || 0,
          proteins: product.nutriments?.proteins_100g || 0,
          fats: product.nutriments?.fat_100g || 0
        },
        calories: product.nutriments?.['energy-kcal_100g'] || 0,
        additives: product.additives_tags || [],
        allergens: product.allergens_tags || []
      };
    } catch (error) {
      console.error('OpenFoodFacts Error:', error);
      return null;
    }
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}
