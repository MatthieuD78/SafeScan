export type NutritionGoal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'health_improvement';

export interface NutritionProfile {
  userId: string;
  goals: NutritionGoal[];
  restrictions: string[];
  allergies: string[];
  budget: 'low' | 'medium' | 'high';
  familySize: number;
  createdAt: string;
  updatedAt: string;
}

export interface MacroSplit {
  carbs: number;
  proteins: number;
  fats: number;
}

export interface NutritionWarning {
  type: 'sugar' | 'salt' | 'fat' | 'fiber' | 'protein' | 'ultra_processed';
  severity: 'low' | 'medium' | 'high';
  message: string;
  affectedProducts: string[];
}

export interface WeeklyAnalysis {
  weekNumber: number;
  year: number;
  overallScore: number;
  macroSplit: MacroSplit;
  nutriScoreAverage: 'A' | 'B' | 'C' | 'D' | 'E';
  warnings: NutritionWarning[];
  achievements: string[];
  analyzedAt: string;
}

export type RecommendationType = 'alternative' | 'addition' | 'recipe' | 'timing' | 'habit';

export interface NutritionRecommendation {
  id: string;
  type: RecommendationType;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  currentProduct?: string;
  suggestedProduct?: string;
  estimatedSavings?: string;
  products?: string[];
  createdAt: string;
}

export interface ProductNutritionInfo {
  barcode?: string;
  name: string;
  brand?: string;
  nutriScore?: 'A' | 'B' | 'C' | 'D' | 'E';
  novaGroup?: 1 | 2 | 3 | 4;
  macros: {
    carbs: number;
    proteins: number;
    fats: number;
  };
  calories: number;
  additives: string[];
  allergens: string[];
}
