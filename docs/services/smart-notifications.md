# Service Rappels Contextuels (Smart Notifications)

## Objectif
Notifications intelligentes basées sur les dates de péremption, les habitudes utilisateur et le contexte temps réel.

## Types de rappels

### 1. Rappels Anti-Gaspi (priorité haute)
- **"Mange tes yaourts"** → 2 jours avant péremption
- **"Utilise tes œufs"** → 1 semaine après achat
- **"Salade à consommer rapidement"** → 3 jours après achat

### 2. Rappels Contextuels (priorité moyenne)
- **"Tu es au supermarché"** → Liste de courses auto-générée
- **"Soirée prévue"** → Suggestion recette rapide avec restes
- **"Week-end"** → Proposition batch cooking

### 3. Rappels de Rappels Sanitaires (priorité critique)
- **Alerte immédiate** → Produit rappelé détecté dans historique
- **Alerte locale** → Rappel produit populaire dans la zone

### 4. Rappels Coach (priorité basse)
- **"C'est l'heure du goûter sain"** → Alternative à tes habituels biscuits
- **"Prépare tes repas de demain"** → Batch cooking suggestion

## Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│  Produits frigo │────→│  Scheduler   │────→│ Notifications│
│  (avec dates)   │     │  (temporal)  │     │  (Push/Local)│
└─────────────────┘     └──────────────┘     └──────────────┘
         │                      │                      │
         ↓                      ↓                      ↓
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│  Contexte user  │────→│  Prioritizer │────→│  UI Badge    │
│  (heure, lieu)  │     │  (scoring)   │     │  (in-app)    │
└─────────────────┘     └──────────────┘     └──────────────┘
```

## Data Model

```typescript
interface SmartReminder {
  id: string;
  type: 'expiration' | 'context' | 'recall' | 'coach';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  action?: {
    type: 'view_recipe' | 'view_product' | 'open_list' | 'dismiss';
    payload: any;
  };
  scheduledAt: string;
  expiresAt: string;
  triggered: boolean;
  dismissed: boolean;
}

interface ProductExpiry {
  productId: string;
  productName: string;
  purchaseDate: string;
  estimatedExpiryDate: string;
  daysRemaining: number;
  urgency: 'critical' | 'warning' | 'info';
}

interface UserContext {
  timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number; // 0-6
  isWeekend: boolean;
  location?: 'home' | 'supermarket' | 'work' | 'other';
}
```

## Algorithmes

### Calcul date péremption
```typescript
const SHELF_LIFE: Record<string, number> = {
  'yaourt': 14,           // jours
  'lait': 7,
  'oeuf': 21,
  'fromage': 14,
  'viande': 3,
  'poisson': 2,
  'salade': 5,
  'pain': 5,
  'fruit': 7,
  'legume': 10,
  'saucisson': 30,
  'jambon': 7,
  'default': 7
};

function estimateExpiry(productName: string, purchaseDate: Date): Date {
  const days = SHELF_LIFE[getProductCategory(productName)] || SHELF_LIFE.default;
  return addDays(purchaseDate, days);
}
```

### Scoring priorité
```typescript
function calculatePriority(expiry: ProductExpiry): number {
  let score = 0;
  
  // Urgence temporelle (0-50 points)
  if (expiry.daysRemaining <= 1) score += 50;
  else if (expiry.daysRemaining <= 2) score += 40;
  else if (expiry.daysRemaining <= 3) score += 30;
  else score += 20;
  
  // Valeur économique (0-30 points)
  score += Math.min(expiry.estimatedValue || 0, 30);
  
  // Historique utilisateur (0-20 points)
  if (isFrequentlyWasted(expiry.productName)) score += 20;
  
  return score;
}
```

## Tech Stack

### Notifications
- **Web Push API** → Notifications navigateur (desktop/mobile)
- **Service Worker** → Background sync
- **Local Notifications** → Quand app ouverte

### Scheduling
- **setInterval** pour vérification toutes les heures
- **Background Sync API** → Quand app fermée (PWA)

### Geolocation
- **Geolocation API** → Détection supermarché proche
- **Geofencing** (si PWA installée) → Alertes entrée/sortie zone

## Flow exemple

**Scenario : Yaourts qui expirent**

1. **Jour -2** (achat) : Produit ajouté au frigo virtuel
2. **Jour 12** : Algorithme détecte expiration dans 2 jours
3. **Notification** : "🥛 Tes yaourts expirent dans 2 jours !"
4. **Action** : Bouton "Voir recettes avec yaourt"
5. **Jour 13** (si non utilisé) : Rappel push "⚠️ Dernier jour pour tes yaourts"
6. **Jour 14** (si gaspillé) : Log pour statistiques anti-gaspi

## UX Guidelines

- **Max 3 notifications/jour** → Évite spam
- **Grouper par type** → "3 produits à consommer ce week-end"
- **Actions contextuelles** → Chaque notif a une action cliquable
- **Snooze possible** → "Rappeler demain"
- **Smart timing** → Pas de notif 3h du matin

## Privacy

- Données produits stockées localement (IndexedDB)
- Pas de tracking localisation en arrière-plan
- Opt-in pour notifications push
