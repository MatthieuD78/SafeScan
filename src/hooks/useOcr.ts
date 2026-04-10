import { useState, useCallback, useRef } from 'react';
import { OcrService, OcrResult } from '../services/ocrService';

interface UseOcrReturn {
  isScanning: boolean;
  progress: number;
  result: OcrResult | null;
  error: string | null;
  scanImage: (image: File | Blob) => Promise<void>;
  reset: () => void;
}

export const useOcr = (): UseOcrReturn => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ocrServiceRef = useRef(new OcrService());

  const scanImage = useCallback(async (image: File | Blob) => {
    setIsScanning(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      // Simulation progress (Tesseract ne donne pas de progress fiable en v2)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const ocrResult = await ocrServiceRef.current.scanReceipt(image);

      clearInterval(progressInterval);
      setProgress(100);
      setResult(ocrResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur OCR inconnue');
    } finally {
      setIsScanning(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsScanning(false);
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return {
    isScanning,
    progress,
    result,
    error,
    scanImage,
    reset
  };
};
