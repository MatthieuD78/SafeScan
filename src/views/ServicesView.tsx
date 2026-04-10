import React from 'react';
import { ServiceConnectors } from '../components/features/services';
import { ConnectedService } from '../types';

interface ServicesViewProps {
  services: ConnectedService[];
  onToggleService: (id: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onToggleService
}) => (
  <div className="pb-12 animate-in fade-in">
    <ServiceConnectors services={services} onToggle={onToggleService} />
  </div>
);
