import { FridgeItem } from '../types';

export type ReminderType = 'expiration' | 'context' | 'recall' | 'coach';
export type ReminderPriority = 'critical' | 'high' | 'medium' | 'low';

export interface SmartReminder {
  id: string;
  type: ReminderType;
  priority: ReminderPriority;
  title: string;
  message: string;
  action?: {
    type: 'view_recipe' | 'view_product' | 'open_list' | 'dismiss';
    payload?: any;
  };
  scheduledAt: string;
  expiresAt: string;
  triggered: boolean;
  dismissed: boolean;
}

export interface ProductExpiry {
  productId: string;
  productName: string;
  purchaseDate: string;
  estimatedExpiryDate: string;
  daysRemaining: number;
  urgency: 'critical' | 'warning' | 'info';
  estimatedValue?: number;
}

// Durée de vie estimée par catégorie (en jours)
const SHELF_LIFE: Record<string, number> = {
  yaourt: 14,
  fromage: 14,
  lait: 7,
  oeuf: 21,
  viande: 3,
  poisson: 2,
  salade: 5,
  pain: 5,
  fruit: 7,
  legume: 10,
  saucisson: 30,
  jambon: 7,
  default: 7
};

export class NotificationService {
  private reminders: SmartReminder[] = [];
  private readonly STORAGE_KEY = 'safescan_reminders';

  constructor() {
    this.loadReminders();
  }

  // Estime la date de péremption d'un produit
  estimateExpiry(productName: string, purchaseDate: Date): ProductExpiry {
    const category = this.getProductCategory(productName.toLowerCase());
    const days = SHELF_LIFE[category] || SHELF_LIFE.default;
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + days);

    const daysRemaining = Math.ceil(
      (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    let urgency: ProductExpiry['urgency'] = 'info';
    if (daysRemaining <= 1) urgency = 'critical';
    else if (daysRemaining <= 3) urgency = 'warning';

    return {
      productId: `${productName}_${purchaseDate.getTime()}`,
      productName,
      purchaseDate: purchaseDate.toISOString(),
      estimatedExpiryDate: expiryDate.toISOString(),
      daysRemaining,
      urgency
    };
  }

  // Génère des rappels basés sur le frigo
  generateExpiryReminders(fridgeItems: FridgeItem[]): SmartReminder[] {
    const reminders: SmartReminder[] = [];
    const now = new Date();

    for (const item of fridgeItems) {
      const expiry = this.estimateExpiry(item.article, now);

      if (expiry.daysRemaining <= 3 && expiry.daysRemaining > 0) {
        const reminder = this.createExpiryReminder(expiry, item.valeur_estimee);
        reminders.push(reminder);
      }
    }

    return reminders.sort((a, b) => this.priorityScore(b.priority) - this.priorityScore(a.priority));
  }

  // Crée un rappel d'expiration
  private createExpiryReminder(expiry: ProductExpiry, value?: string): SmartReminder {
    const daysText = expiry.daysRemaining === 1 
      ? 'demain' 
      : `dans ${expiry.daysRemaining} jours`;

    const priority: ReminderPriority = expiry.daysRemaining <= 1 ? 'critical' : 'high';
    const estimatedValue = value ? parseFloat(value.replace('€', '').replace(',', '.')) : 0;

    return {
      id: `expiry_${expiry.productId}`,
      type: 'expiration',
      priority,
      title: `⏰ ${expiry.productName} expire ${daysText}`,
      message: `Valeur: ${value || 'Non estimée'} - Pense à le consommer rapidement !`,
      action: {
        type: 'view_recipe',
        payload: { ingredient: expiry.productName }
      },
      scheduledAt: new Date().toISOString(),
      expiresAt: expiry.estimatedExpiryDate,
      triggered: false,
      dismissed: false
    };
  }

  // Scoring pour tri
  private priorityScore(priority: ReminderPriority): number {
    const scores = { critical: 100, high: 75, medium: 50, low: 25 };
    return scores[priority];
  }

  // Détermine la catégorie d'un produit
  private getProductCategory(productName: string): string {
    const keywords: Record<string, string[]> = {
      yaourt: ['yaourt', 'yogourt', 'fromage blanc'],
      fromage: ['fromage', 'camembert', 'brie', 'comté'],
      lait: ['lait', 'crème'],
      oeuf: ['oeuf', 'oeufs'],
      viande: ['viande', 'boeuf', 'poulet', 'porc', 'dinde'],
      poisson: ['poisson', 'saumon', 'thon'],
      salade: ['salade', 'roquette', 'epinard'],
      pain: ['pain', 'baguette', 'brioche'],
      fruit: ['fruit', 'pomme', 'banane', 'orange'],
      legume: ['legume', 'carotte', 'courgette', 'tomate'],
      saucisson: ['saucisson', 'saucisse'],
      jambon: ['jambon']
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => productName.includes(word))) {
        return category;
      }
    }
    return 'default';
  }

  // Charge les rappels depuis le stockage
  private loadReminders(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.reminders = JSON.parse(stored);
    }
  }

  // Sauvegarde les rappels
  saveReminders(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reminders));
  }

  // Marquer comme déclenché
  markTriggered(id: string): void {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.triggered = true;
      this.saveReminders();
    }
  }

  // Dismiss un rappel
  dismissReminder(id: string): void {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.dismissed = true;
      this.saveReminders();
    }
  }

  // Récupère les rappels actifs
  getActiveReminders(): SmartReminder[] {
    return this.reminders.filter(r => !r.dismissed && !r.triggered);
  }

  // Demande permission notifications navigateur
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Ce navigateur ne supporte pas les notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Envoie une notification navigateur
  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}
