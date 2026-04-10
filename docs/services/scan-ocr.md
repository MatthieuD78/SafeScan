# Service Scan OCR

## Objectif
Transformer une photo de ticket de caisse en texte structuré automatiquement, sans saisie manuelle.

## Architecture

```
Photo (camera/file) → OCR Engine → Texte brut → Gemini (structure) → Données JSON
```

## Technologies

### Option 1 : Tesseract.js (100% local, gratuit)
- Bibliothèque JavaScript OCR
- Avantage : Offline, pas de coût API
- Inconvénient : Moins précis sur écriture manuscrite

### Option 2 : Google Vision API (cloud, payant)
- API Google Cloud Vision
- Avantage : Très précis, multi-langues
- Inconvénient : Coût par requête, besoin connexion

### Option 3 : Hybrid (recommandé)
- Tesseract.js par défaut (offline)
- Fallback Google Vision si qualité insuffisante

## Flow utilisateur

1. **Capture** : Photo depuis caméra ou upload
2. **Prétraitement** : Rotation auto, amélioration contraste
3. **OCR** : Extraction texte brut
4. **NLP** : Gemini structure les données
5. **Validation** : Utilisateur confirme/modifie

## Composants à créer

### Frontend
- `CameraCapture.tsx` - Interface caméra
- `ImageUploader.tsx` - Upload fichier
- `OcrProgress.tsx` - Indicateur progression
- `OcrValidation.tsx` - Édition post-OCR

### Service
- `ocrService.ts` - Wrapper Tesseract + prétraitement
- `receiptParser.ts` - Conversion texte → structure

## Dépendances

```bash
npm install tesseract.js
npm install -D @types/tesseract.js
```

## Exemple d'implémentation

```typescript
// services/ocrService.ts
import Tesseract from 'tesseract.js';

export class OcrService {
  async scanReceipt(image: File | Blob): Promise<string> {
    const result = await Tesseract.recognize(
      image,
      'fra', // Langue française
      {
        logger: m => console.log(m), // Progress
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,€-/% '
      }
    );
    return result.data.text;
  }
}
```

## Performance
- Temps cible : < 3 secondes
- Taille image optimale : 1080x1920px
- Format supporté : JPEG, PNG, WEBP

## UX
- Feedback visuel pendant scan
- Option "corriger manuellement" si confiance < 80%
- Historique des scans récents
