import React from 'react';

// Hooks
import {
  useReceiptAnalysis,
  useNfcSimulation,
  useSettings,
  useRecallsSearch,
  useConnectedServices,
  useRecipeModal,
  useRappelConso
} from './hooks';

// Constants
import { OFFICIAL_RECALLS } from './constants';

// Components
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { RecipeModal } from './components/features/results/RecipeModal';
import { SettingsModal } from './components/features/settings/SettingsModal';
import { RealTimeRecallBanner } from './components/features/alerts/RealTimeRecallBanner';

// Views
import { ScanView } from './views/ScanView';
import { AlertsView } from './views/AlertsView';
import { ServicesView } from './views/ServicesView';

// Types
import { TabType } from './types';

const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = React.useState<TabType>('scan');

  // Analysis
  const { isAnalyzing, result, error, analyze, reset: resetAnalysis } = useReceiptAnalysis();

  // NFC
  const { isScanning, receiptText, simulateNfcPayment, updateReceiptText } = useNfcSimulation();

  // Settings
  const { settings, showSettingsModal, toggleSetting, openSettings, closeSettings } = useSettings();

  // Recalls Search
  const { searchTerm, setSearchTerm, filteredRecalls } = useRecallsSearch(OFFICIAL_RECALLS);

  // Connected Services
  const { services, toggleService } = useConnectedServices();

  // Recipe Modal
  const { selectedRecipe, openRecipe, closeRecipe } = useRecipeModal();

  // RappelConso temps réel
  const {
    activeAlerts,
    checkProducts,
    dismissAlert,
    refreshRecalls,
    lastUpdated,
    isLoading: isRecallsLoading,
    criticalAlertsCount
  } = useRappelConso();

  // Bilan Details
  const [showBilanDetails, setShowBilanDetails] = React.useState(false);

  // Handle NFC Scan
  const handleNfcScan = async () => {
    const scannedText = await simulateNfcPayment();
    await analyze(scannedText, OFFICIAL_RECALLS, settings);
    
    // Vérifie les produits scannés contre RappelConso
    const products = scannedText.split('\n').map(line => ({ name: line.trim() }));
    await checkProducts(products);
    
    setShowBilanDetails(false);
  };

  // Handle Manual Analyze
  const handleManualAnalyze = async () => {
    analyze(receiptText, OFFICIAL_RECALLS, settings);
    
    // Vérifie les produits scannés contre RappelConso
    const products = receiptText.split('\n').map(line => ({ name: line.trim() }));
    await checkProducts(products);
    
    setShowBilanDetails(false);
  };

  // Handle Tab Change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'scan' && error) {
      resetAnalysis();
    }
  };

  // Handle Receipt Text Change
  const handleReceiptChange = (text: string) => {
    updateReceiptText(text);
  };

  // Render Current View
  const renderView = () => {
    switch (activeTab) {
      case 'scan':
        return (
          <div className="space-y-4">
            {/* Alerte RappelConso temps réel */}
            <RealTimeRecallBanner
              alerts={activeAlerts}
              onDismiss={dismissAlert}
              onRefresh={refreshRecalls}
              lastUpdated={lastUpdated}
              isLoading={isRecallsLoading}
            />
            
            <ScanView
              receiptText={receiptText}
              onReceiptChange={handleReceiptChange}
              isNfcScanning={isScanning}
              onNfcScan={handleNfcScan}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleManualAnalyze}
              result={result}
              showBilanDetails={showBilanDetails}
              onToggleBilan={() => setShowBilanDetails(!showBilanDetails)}
              onRecipeClick={openRecipe}
            />
          </div>
        );
      case 'alerts':
        return (
          <AlertsView
            recalls={filteredRecalls}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        );
      case 'services':
        return (
          <ServicesView
            services={services}
            onToggleService={toggleService}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      <Header onSettingsClick={openSettings} />

      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {renderView()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Modals */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={closeRecipe}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={closeSettings}
        settings={settings}
        onToggleSetting={toggleSetting}
      />

      {/* Error Toast */}
      {error && (
        <div className="fixed top-20 left-4 right-4 max-w-3xl mx-auto bg-red-500 text-white p-4 rounded-2xl shadow-xl z-50 animate-in slide-in-from-top">
          <p className="font-bold text-center">{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;
