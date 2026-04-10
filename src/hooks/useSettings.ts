import { useState, useCallback } from 'react';
import { AppSettings } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  detectSugars: true,
  autoSyncBank: true,
  subscriptionActive: true
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleSetting = useCallback((key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const openSettings = useCallback(() => setShowSettingsModal(true), []);
  const closeSettings = useCallback(() => setShowSettingsModal(false), []);

  return {
    settings,
    showSettingsModal,
    updateSetting,
    toggleSetting,
    openSettings,
    closeSettings
  };
};
