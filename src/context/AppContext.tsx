import React, { createContext, useContext, useState, useCallback } from 'react';
import { TabType, SafeScanResponse, OptionFaitMaison, AppSettings } from '../types';

interface AppContextType {
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Scan
  receiptText: string;
  setReceiptText: (text: string) => void;

  // Analysis
  analysisResult: SafeScanResponse | null;
  setAnalysisResult: (result: SafeScanResponse | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
  analysisError: string | null;
  setAnalysisError: (error: string | null) => void;

  // Bilan
  showBilanDetails: boolean;
  setShowBilanDetails: (value: boolean) => void;
  toggleBilanDetails: () => void;

  // Recipe
  selectedRecipe: OptionFaitMaison | null;
  setSelectedRecipe: (recipe: OptionFaitMaison | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('scan');
  const [receiptText, setReceiptText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<SafeScanResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showBilanDetails, setShowBilanDetails] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<OptionFaitMaison | null>(null);

  const toggleBilanDetails = useCallback(() => {
    setShowBilanDetails(prev => !prev);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        receiptText,
        setReceiptText,
        analysisResult,
        setAnalysisResult,
        isAnalyzing,
        setIsAnalyzing,
        analysisError,
        setAnalysisError,
        showBilanDetails,
        setShowBilanDetails,
        toggleBilanDetails,
        selectedRecipe,
        setSelectedRecipe
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
