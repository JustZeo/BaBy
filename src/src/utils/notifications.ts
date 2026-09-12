/**
 * Baby — Local Offline Notifications
 * All notifications are scheduled purely on-device with zero internet dependency.
 * Gracefully guards against Expo Go SDK 53+ Android limitation.
 */

import { isRunningInExpoGo } from 'expo';
import { NotificationSettings } from '../types';

let Notifications: any = null;

// Only load expo-notifications in standalone/development builds (EAS builds),
// avoiding the Expo Go SDK 53+ Android push token listener crash.
if (!isRunningInExpoGo()) {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    console.warn('[Notifications] Not available in this environment:', e);
  }
}

/**
 * Request notification permissions locally.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (isRunningInExpoGo() || !Notifications) return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    console.warn('[Notifications] Error requesting permissions:', e);
    return false;
  }
}

/**
 * Schedule offline notifications based on user settings.
 */
export async function scheduleOfflineReminders(
  settings: NotificationSettings,
  daysUntilPeriod: number
): Promise<void> {
  if (isRunningInExpoGo() || !Notifications || !settings.enabled) return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const granted = await requestNotificationPermissions();
    if (!granted) return;

    // 1. Period Reminder: "Cycle may start tomorrow."
    if (settings.periodReminder && daysUntilPeriod <= 2) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌸 Baby',
          body: 'Her cycle may start tomorrow. A gentle time to have comfort snacks & heating pad ready! 💕',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3600 * 4,
          repeats: false,
        },
      });
    }

    // 2. Daily Log Reminder: "Don't forget today's mood."
    if (settings.dailyLogReminder) {
      const [hourStr, minStr] = (settings.dailyLogReminderTime || '20:00').split(':');
      const hour = parseInt(hourStr, 10) || 20;
      const minute = parseInt(minStr, 10) || 0;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📖 Evening Check-in',
          body: "Don't forget to check in on how she felt today and log her mood! ✨",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    }

    // 3. Water Reminder: "Water reminder."
    if (settings.waterReminder) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Hydration Time',
          body: 'Gentle reminder: Offer her a glass of water (and drink one yourself)! 💖',
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3600 * (settings.waterReminderInterval || 3),
          repeats: true,
        },
      });
    }
  } catch (error) {
    console.warn('[Notifications] Could not schedule local reminders:', error);
  }
}
