import Tesseract from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export class OcrService {
  private worker: Tesseract.Worker | null = null;

  async initialize(): Promise<void> {
    this.worker = await Tesseract.createWorker('fra');
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }

  async scanReceipt(image: File | Blob | string): Promise<OcrResult> {
    if (!this.worker) {
      await this.initialize();
    }

    const startTime = Date.now();

    try {
      const result = await Tesseract.recognize(
        image,
        'fra',
        {
          logger: () => {}, // Silencieux en prod
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,€-/% '
        }
      );

      const processingTime = Date.now() - startTime;

      // Post-traitement : nettoyage du texte
      const cleanedText = this.cleanReceiptText(result.data.text);

      return {
        text: cleanedText,
        confidence: result.data.confidence,
        processingTime
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Échec de la reconnaissance du ticket');
    }
  }

  private cleanReceiptText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ ]{2,}/g, ' ')
      .replace(/^\s+|\s+$/gm, '')
      .split('\n')
      .filter(line => line.length > 2)
      .join('\n');
  }

  // Vérifie si la qualité est suffisante
  isQualityAcceptable(confidence: number): boolean {
    return confidence >= 60;
  }
}
