import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class NotificationsScheduler {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userService: UserService,
  ) {}

  @Cron('0 13 * * *') // Every day at 13:00
  async handleFirstDailyReminder() {
    await this.sendDailyReminders();
  }

  @Cron('0 19 * * *') // Every day at 19:00
  async handleSecondDailyReminder() {
    await this.sendDailyReminders();
  }

  private async sendDailyReminders() {
    try {
      const users = await this.userService.findAll();
      
      for (const user of users) {
        if (user.fcmToken) {
          await this.notificationsService.sendDailyReminder(
            user._id.toString(),
            user.level,
            user.fcmToken,
          );
        }
      }
    } catch (error) {
      console.error('Error sending daily reminders:', error);
    }
  }
} 