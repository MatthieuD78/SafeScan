# Service Coach Nutrition Personnalisé

## Objectif
Analyser l'historique des courses et fournir des recommandations personnalisées pour améliorer l'alimentation.

## Fonctionnalités

### 1. Profil Nutritionnel
- Objectifs utilisateur (perte de poids, gain muscle, équilibre)
- Restrictions (allergies, régimes spéciaux)
- Préférences (goûts, budget)

### 2. Analyse du Panier Hebdomadaire
- Score nutritionnel global (A à E)
- Répartition macros (glucides/lipides/protéines)
- Détection des excès (sucre, sel, gras saturés)
- Identification des nutriments manquants

### 3. Recommandations Intelligentes
- **Alternatives** : "Remplace tes sodas par des infusions → -15% sucre"
- **Compléments** : "Ajoute des légumineuses pour les protéines"
- **Recettes** : Suggestions basées sur les restes du frigo
- **Timing** : Quand manger certains aliments pour optimiser

### 4. Suivi d'Évolution
- Graphique mensuel du score nutritionnel
- Tendances d'amélioration
- Badges et récompenses (gamification)

## Architecture

```
Historique courses → Analyse Gemini → Profil → Recommandations → UI
        ↓               ↓              ↓            ↓
   localStorage    Calcul scores    User prefs   Suggestions
```

## Data Model

```typescript
interface NutritionProfile {
  userId: string;
  goals: NutritionGoal[];
  restrictions: string[];
  allergies: string[];
  budget: 'low' | 'medium' | 'high';
  familySize: number;
}

interface WeeklyAnalysis {
  weekNumber: number;
  overallScore: number; // 0-100
  macroSplit: {
    carbs: number;
    proteins: number;
    fats: number;
  };
  warnings: NutritionWarning[];
  achievements: string[];
}

interface NutritionRecommendation {
  type: 'alternative' | 'addition' | 'recipe' | 'timing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string; // ex: "-20% sucre ajouté"
  products?: string[]; // Produits concernés
}
```

## Prompt Gemini

```
Tu es un nutritionniste expert. Analyse ce panier de courses hebdomadaire.

PANIER:
{{receiptItems}}

PROFIL UTILISATEUR:
- Objectif: {{goal}}
- Restrictions: {{restrictions}}

Fournis:
1. Score nutritionnel (0-100)
2. Répartition macros (%)
3. 3 points d'amélioration prioritaires
4. 2 alternatives concrètes (produit actuel → produit recommandé)
5. 1 suggestion de recette avec les produits du panier

Format JSON strict.
```

## Composants UI

- `NutritionDashboard.tsx` - Vue d'ensemble hebdo
- `NutritionScoreCard.tsx` - Score avec jauges
- `RecommendationCard.tsx` - Carte recommandation
- `MacroChart.tsx` - Graphique répartition
- `ImprovementTracker.tsx` - Suivi progression

## Intégration OpenFoodFacts (gratuit)

API pour enrichir les données nutritionnelles :
```
https://world.openfoodfacts.org/api/v0/product/{barcode}.json
```

Avantages :
- Nutri-Score officiel
- Nova group (ultra-transformés)
- Allergènes détaillés
- 100% gratuit
