import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  constructor() {
    this.lastNotificationTime = null;
  }

  async init() {
    try {
      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get Expo push token
      const token = await this.getExpoPushToken();
      console.log('Expo Push Token:', token);

      // Set up notification handlers
      Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });

      Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response:', response);
      });

    } catch (error) {
      console.error('Notification service initialization failed:', error);
    }
  }

  async getExpoPushToken() {
    try {
      let token = await AsyncStorage.getItem('expoPushToken');
      
      if (!token) {
        const { data: token } = await Notifications.getExpoPushTokenAsync({
          projectId: 'f47f9cb7-3fc9-4d77-9cf7-e94be2db0813'
        });
        if (token) {
          await AsyncStorage.setItem('expoPushToken', token);
        }
      }
      
      return token;
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  }

  async scheduleReminderNotifications() {
    // Schedule reminders for 13:00 and 19:00
    const now = new Date();
    const reminder1 = new Date(now);
    reminder1.setHours(13, 0, 0, 0);
    
    const reminder2 = new Date(now);
    reminder2.setHours(19, 0, 0, 0);

    // If time has passed for today, schedule for tomorrow
    if (now > reminder1) {
      reminder1.setDate(reminder1.getDate() + 1);
    }
    if (now > reminder2) {
      reminder2.setDate(reminder2.getDate() + 1);
    }

    // Schedule the notifications
    await Promise.all([
      Notifications.scheduleNotificationAsync({
        content: {
          title: '🎯 Time to Practice!',
          body: 'Keep your learning streak going with a quick game!',
        },
        trigger: {
          hour: 13,
          minute: 0,
          repeats: true,
        },
      }),
      Notifications.scheduleNotificationAsync({
        content: {
          title: '📚 Evening Study Time',
          body: 'End your day with some language practice!',
        },
        trigger: {
          hour: 19,
          minute: 0,
          repeats: true,
        },
      }),
    ]);

    // Store the scheduled times
    await AsyncStorage.setItem('lastScheduledReminders', JSON.stringify({
      reminder1: reminder1.toISOString(),
      reminder2: reminder2.toISOString()
    }));
  }

  async sendLevelUpNotification(newLevel) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Level Up!',
        body: `Congratulations! You've reached level ${newLevel}!`,
        data: { type: 'LEVEL_UP', level: newLevel.toString() },
      },
      trigger: null, // Show immediately
    });
  }

  async sendNewUserNotification(language) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '👋 New Language Partner!',
        body: `A new user learning ${language} just joined the community!`,
        data: { type: 'NEW_USER', language },
      },
      trigger: null, // Show immediately
    });
  }
}

export default new NotificationService(); 