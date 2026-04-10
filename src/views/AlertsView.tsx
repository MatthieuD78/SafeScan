import React from 'react';
import { RecallList } from '../components/features/alerts';
import { RecallAlert } from '../types';

interface AlertsViewProps {
  recalls: RecallAlert[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  recalls,
  searchTerm,
  onSearchChange
}) => (
  <div className="space-y-4 pb-12 animate-in fade-in">
    <RecallList
      recalls={recalls}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />
  </div>
);
