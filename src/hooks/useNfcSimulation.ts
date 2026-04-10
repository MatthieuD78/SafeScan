import { useState, useCallback } from 'react';
import { RECEIPT_EXAMPLES } from '../constants';

export const useNfcSimulation = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [receiptText, setReceiptText] = useState('');

  const simulateNfcPayment = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      setIsScanning(true);

      setTimeout(() => {
        const randomReceipt = RECEIPT_EXAMPLES[Math.floor(Math.random() * RECEIPT_EXAMPLES.length)];
        setReceiptText(randomReceipt);
        setIsScanning(false);
        resolve(randomReceipt);
      }, 2000);
    });
  }, []);

  const updateReceiptText = useCallback((text: string) => {
    setReceiptText(text);
  }, []);

  return {
    isScanning,
    receiptText,
    simulateNfcPayment,
    updateReceiptText
  };
};
