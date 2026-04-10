import { useState, useCallback, useEffect } from 'react';
import { NutritionService } from '../services/nutritionService';
import { 
  NutritionProfile, 
  WeeklyAnalysis, 
  NutritionRecommendation 
} from '../types/nutrition';
import { FridgeItem } from '../types';

const STORAGE_KEY = 'safescan_nutrition_profile';

interface UseNutritionReturn {
  profile: NutritionProfile | null;
  analysis: WeeklyAnalysis | null;
  recommendations: NutritionRecommendation[];
  isAnalyzing: boolean;
  updateProfile: (profile: Partial<NutritionProfile>) => void;
  analyzeBasket: (items: FridgeItem[]) => Promise<void>;
  dismissRecommendation: (id: string) => void;
}

export const useNutrition = (): UseNutritionReturn => {
  const [profile, setProfile] = useState<NutritionProfile | null>(null);
  const [analysis, setAnalysis] = useState<WeeklyAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<NutritionRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const nutritionService = new NutritionService();

  // Charge le profil depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      // Profil par défaut
      setProfile({
        userId: 'user_' + Date.now(),
        goals: ['health_improvement'],
        restrictions: [],
        allergies: [],
        budget: 'medium',
        familySize: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, []);

  // Sauvegarde le profil
  const updateProfile = useCallback((updates: Partial<NutritionProfile>) => {
    setProfile(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const analyzeBasket = useCallback(async (items: FridgeItem[]) => {
    if (!profile || items.length === 0) return;

    setIsAnalyzing(true);
    try {
      const { analysis: newAnalysis, recommendations: newRecs } = 
        await nutritionService.analyzeWeeklyBasket(items, profile);
      
      setAnalysis(newAnalysis);
      setRecommendations(prev => [...newRecs, ...prev].slice(0, 10)); // Max 10 recs
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [profile]);

  const dismissRecommendation = useCallback((id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  }, []);

  return {
    profile,
    analysis,
    recommendations,
    isAnalyzing,
    updateProfile,
    analyzeBasket,
    dismissRecommendation
  };
};
