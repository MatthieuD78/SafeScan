import { useState, useCallback, useEffect, useRef } from 'react';
import { NotificationService, SmartReminder } from '../services/notificationService';
import { FridgeItem } from '../types';

interface UseRemindersReturn {
  reminders: SmartReminder[];
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
  dismissReminder: (id: string) => void;
  refreshReminders: (fridgeItems: FridgeItem[]) => void;
  activeReminderCount: number;
}

const CHECK_INTERVAL = 60 * 60 * 1000; // Vérification toutes les heures

export const useReminders = (): UseRemindersReturn => {
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  
  const serviceRef = useRef(new NotificationService());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Vérifie la permission au mount
  useEffect(() => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  // Charge les rappels actifs
  useEffect(() => {
    const active = serviceRef.current.getActiveReminders();
    setReminders(active);
  }, []);

  // Boucle de vérification périodique
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const active = serviceRef.current.getActiveReminders();
      
      // Déclenche les notifications pour les rappels non encore notifiés
      active.forEach(reminder => {
        if (!reminder.triggered && !reminder.dismissed) {
          serviceRef.current.sendNotification(reminder.title, {
            body: reminder.message,
            icon: '/logo.png',
            tag: reminder.id,
            requireInteraction: reminder.priority === 'critical'
          });
          serviceRef.current.markTriggered(reminder.id);
        }
      });

      setReminders(active);
    }, CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await serviceRef.current.requestNotificationPermission();
    setHasPermission(granted);
  }, []);

  const dismissReminder = useCallback((id: string) => {
    serviceRef.current.dismissReminder(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const refreshReminders = useCallback((fridgeItems: FridgeItem[]) => {
    const newReminders = serviceRef.current.generateExpiryReminders(fridgeItems);
    setReminders(newReminders);
    
    // Sauvegarde
    newReminders.forEach(r => {
      if (!serviceRef.current.getActiveReminders().find(existing => existing.id === r.id)) {
        // Nouveau rappel
      }
    });
  }, []);

  return {
    reminders,
    hasPermission,
    requestPermission,
    dismissReminder,
    refreshReminders,
    activeReminderCount: reminders.filter(r => !r.dismissed).length
  };
};
