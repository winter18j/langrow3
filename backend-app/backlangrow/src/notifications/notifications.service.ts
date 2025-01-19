import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../config/firebase/firebase.service-account.json';

@Injectable()
export class NotificationsService {
  constructor() {
    // Initialize Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
      });
    }
  }

  async sendDailyReminder(userId: string, userLevel: number, fcmToken: string) {
    try {
      const message = {
        notification: {
          title: '📚 Daily Language Practice',
          body: `Level ${userLevel} - Keep up the great work! Time for some language practice.`,
        },
        data: {
          type: 'DAILY_REMINDER',
          level: userLevel.toString(),
        },
        token: fcmToken,
      };

      await admin.messaging().send(message);
      return true;
    } catch (error) {
      console.error('Error sending daily reminder:', error);
      return false;
    }
  }

  async sendLevelUpNotification(userId: string, newLevel: number, fcmToken: string) {
    try {
      const message = {
        notification: {
          title: '🎉 Level Up!',
          body: `Congratulations! You've reached level ${newLevel}!`,
        },
        data: {
          type: 'LEVEL_UP',
          level: newLevel.toString(),
        },
        token: fcmToken,
      };

      await admin.messaging().send(message);
      return true;
    } catch (error) {
      console.error('Error sending level up notification:', error);
      return false;
    }
  }

  async sendNewUserNotification(language: string, fcmTokens: string[]) {
    try {
      const message = {
        notification: {
          title: '👋 New Language Partner!',
          body: `A new user learning ${language} just joined the community!`,
        },
        data: {
          type: 'NEW_USER',
          language,
        },
      };

      // Send to multiple tokens
      await Promise.all(
        fcmTokens.map(token =>
          admin.messaging().send({
            ...message,
            token,
          })
        )
      );
      return true;
    } catch (error) {
      console.error('Error sending new user notification:', error);
      return false;
    }
  }
} 