import { useState, useCallback, useEffect, useRef } from 'react';
import { RappelConsoService } from '../services/rappelConsoService';
import { RappelConsoOfficial, RecallMatch, ActiveRecallAlert } from '../types/rappelconso';

interface UseRappelConsoReturn {
  // Données
  latestRecalls: RappelConsoOfficial[];
  activeAlerts: ActiveRecallAlert[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  checkProducts: (products: { name: string; brand?: string; lot?: string }[]) => Promise<void>;
  searchRecalls: (query: string) => Promise<RappelConsoOfficial[]>;
  refreshRecalls: () => Promise<void>;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;

  // Stats
  criticalAlertsCount: number;
  hasUnseenAlerts: boolean;
}

const STORAGE_KEY = 'safescan_recall_alerts';
const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const useRappelConso = (): UseRappelConsoReturn => {
  const [latestRecalls, setLatestRecalls] = useState<RappelConsoOfficial[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<ActiveRecallAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const serviceRef = useRef(new RappelConsoService());
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Charge les alertes sauvegardées
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setActiveAlerts(JSON.parse(stored));
      } catch {
        // Ignore parse error
      }
    }
  }, []);

  // Sauvegarde les alertes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeAlerts));
  }, [activeAlerts]);

  // Polling automatique
  useEffect(() => {
    const fetchData = async () => {
      try {
        const recalls = await serviceRef.current.fetchLatestRecalls(50);
        setLatestRecalls(recalls);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    // Premier fetch
    fetchData();

    // Polling toutes les 5 minutes
    pollingRef.current = setInterval(fetchData, POLLING_INTERVAL);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Vérifie une liste de produits contre les rappels
  const checkProducts = useCallback(async (
    products: { name: string; brand?: string; lot?: string }[]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const newAlerts: ActiveRecallAlert[] = [];

      for (const product of products) {
        const matches = await serviceRef.current.checkProduct(
          product.name,
          product.brand,
          product.lot
        );

        for (const match of matches) {
          const alertId = `alert_${match.rappel.id}_${Date.now()}`;
          newAlerts.push({
            id: alertId,
            match,
            detectedAt: new Date().toISOString(),
            dismissed: false
          });
        }
      }

      // Merge avec les alertes existantes (évite doublons)
      setActiveAlerts(prev => {
        const existingIds = new Set(prev.map(a => a.match.rappel.id));
        const uniqueNew = newAlerts.filter(a => !existingIds.has(a.match.rappel.id));
        return [...uniqueNew, ...prev];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de vérification');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Recherche textuelle
  const searchRecalls = useCallback(async (query: string) => {
    return serviceRef.current.searchRecalls(query);
  }, []);

  // Force refresh
  const refreshRecalls = useCallback(async () => {
    setIsLoading(true);
    try {
      const recalls = await serviceRef.current.forceRefresh();
      setLatestRecalls(recalls);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de rafraîchissement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Dismiss une alerte
  const dismissAlert = useCallback((alertId: string) => {
    setActiveAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, dismissed: true } : a))
    );
  }, []);

  // Clear toutes les alertes
  const clearAllAlerts = useCallback(() => {
    setActiveAlerts([]);
  }, []);

  // Stats
  const criticalAlertsCount = activeAlerts.filter(
    a => !a.dismissed && a.match.severity === 'CRITICAL'
  ).length;

  const hasUnseenAlerts = activeAlerts.some(a => !a.dismissed && !a.actionTaken);

  return {
    latestRecalls,
    activeAlerts,
    isLoading,
    error,
    lastUpdated,
    checkProducts,
    searchRecalls,
    refreshRecalls,
    dismissAlert,
    clearAllAlerts,
    criticalAlertsCount,
    hasUnseenAlerts
  };
};
