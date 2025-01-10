import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import axios from 'axios';
import { Platform } from 'react-native';

const DEV_BACKEND_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: `http://${Constants.expoConfig.hostUri.split(':').shift()}:3000`,
});

const API_URL = 'https://votre-backend-url.com'; // Remplacez par l'URL de votre backend

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async registerForPushNotifications() {
    try {
      if (!Device.isDevice) {
        return null;
      }

      // Demander la permission pour les notifications
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return null;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des notifications:', error);
      return null;
    }
  },

  async updateUserToken(userId, token) {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/fcm-token`, {
        token,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du token FCM:', error);
      throw error;
    }
  },

  setupNotificationListeners(onNotificationReceived) {
    const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      onNotificationReceived(notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      // Logique pour gérer les réponses aux notifications
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }
}; 