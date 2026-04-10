import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../ui/Button';

interface ScanInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  disabled?: boolean;
}

export const ScanInput: React.FC<ScanInputProps> = ({
  value,
  onChange,
  onAnalyze,
  disabled = false
}) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
    <textarea
      className="w-full h-24 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono mb-3 resize-none"
      placeholder="Collez le texte de votre ticket ici..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    <Button 
      onClick={onAnalyze} 
      fullWidth 
      variant="secondary"
      isLoading={disabled}
      disabled={!value.trim() || disabled}
    >
      <Search className="w-4 h-4" /> Analyser manuel
    </Button>
  </div>
);
