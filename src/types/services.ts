export type ServiceType = 'bank' | 'loyalty' | 'nfc';
export type ServiceStatus = 'connected' | 'disconnected';

export interface ConnectedService {
  id: string;
  name: string;
  status: ServiceStatus;
  type: ServiceType;
}
