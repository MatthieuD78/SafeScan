import { useState, useCallback } from 'react';
import { ConnectedService, ServiceStatus } from '../types';

const DEFAULT_SERVICES: ConnectedService[] = [
  { id: '1', name: 'Ma Banque (Société Générale)', status: 'connected', type: 'bank' },
  { id: '2', name: 'NFC Carrefour / Leclerc', status: 'disconnected', type: 'nfc' },
];

export const useConnectedServices = () => {
  const [services, setServices] = useState<ConnectedService[]>(DEFAULT_SERVICES);

  const toggleService = useCallback((id: string) => {
    setServices(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, status: s.status === 'connected' ? 'disconnected' : 'connected' }
          : s
      )
    );
  }, []);

  const updateServiceStatus = useCallback((id: string, status: ServiceStatus) => {
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, status } : s))
    );
  }, []);

  return {
    services,
    toggleService,
    updateServiceStatus
  };
};
