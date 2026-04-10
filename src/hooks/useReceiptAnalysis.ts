import { useState, useCallback } from 'react';
import { GeminiService } from '../services/geminiService';
import { SafeScanResponse, RecallAlert, AppSettings } from '../types';

export const useReceiptAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SafeScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const geminiService = new GeminiService();

  const analyze = useCallback(async (
    receiptText: string,
    recalls: RecallAlert[],
    settings: AppSettings
  ): Promise<void> => {
    if (!receiptText.trim()) {
      setError("Veuillez saisir le texte d'un ticket.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await geminiService.analyzeReceipt(receiptText, recalls, settings);
      setResult(data);
    } catch (err) {
      console.error('Analysis Error:', err);
      setError("Erreur lors de l'analyse.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    result,
    error,
    analyze,
    reset
  };
};
