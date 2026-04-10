import React from 'react';
import { ShieldAlert, Calendar, Leaf } from 'lucide-react';
import { NfcButton, ScanInput, AnalyzingSpinner } from '../components/features/scan';
import { BilanCard, SecurityAlert, FridgeList, NutritionCoach } from '../components/features/results';
import { SectionTitle } from '../components/ui/SectionTitle';
import { SafeScanResponse, OptionFaitMaison, AppSettings } from '../types';

interface ScanViewProps {
  // Input
  receiptText: string;
  onReceiptChange: (text: string) => void;

  // NFC
  isNfcScanning: boolean;
  onNfcScan: () => void;

  // Analysis
  isAnalyzing: boolean;
  onAnalyze: () => void;

  // Results
  result: SafeScanResponse | null;

  // Bilan
  showBilanDetails: boolean;
  onToggleBilan: () => void;

  // Recipe
  onRecipeClick: (recipe: OptionFaitMaison) => void;
}

export const ScanView: React.FC<ScanViewProps> = ({
  receiptText,
  onReceiptChange,
  isNfcScanning,
  onNfcScan,
  isAnalyzing,
  onAnalyze,
  result,
  showBilanDetails,
  onToggleBilan,
  onRecipeClick
}) => {
  const hasResult = result && !isAnalyzing;

  return (
    <div className="space-y-6 pb-12">
      {/* NFC & Camera Buttons */}
      <NfcButton isScanning={isNfcScanning} onScan={onNfcScan} />

      {/* Manual Input */}
      <ScanInput
        value={receiptText}
        onChange={onReceiptChange}
        onAnalyze={onAnalyze}
        disabled={isAnalyzing}
      />

      {/* Loading State */}
      {isAnalyzing && <AnalyzingSpinner />}

      {/* Results */}
      {hasResult && (
        <div className="space-y-6 pb-12 animate-in slide-in-from-bottom-6 duration-500">
          {/* Bilan Card */}
          <BilanCard
            totalEconomy={result.bilan_economique}
            details={result.details_economies}
            isExpanded={showBilanDetails}
            onToggle={onToggleBilan}
          />

          {/* Security Section */}
          <section className="space-y-3">
            <SectionTitle icon={ShieldAlert}>Sécurité</SectionTitle>
            <SecurityAlert alert={result.alerte_sanitaire} />
          </section>

          {/* Anti-Gaspi Section */}
          <section className="space-y-3">
            <SectionTitle icon={Calendar}>Frigo Intelligent</SectionTitle>
            <FridgeList items={result.gestion_frigo} />
          </section>

          {/* Nutrition Section */}
          <section className="space-y-3">
            <SectionTitle icon={Leaf}>Smart Swaps</SectionTitle>
            <NutritionCoach
              data={result.optimisation_sante}
              onRecipeClick={onRecipeClick}
            />
          </section>
        </div>
      )}
    </div>
  );
};
