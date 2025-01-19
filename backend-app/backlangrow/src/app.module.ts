import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WordPairsModule } from './word-pairs/word-pairs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsScheduler } from './notifications/notifications.scheduler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    WordPairsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsScheduler],
})
export class AppModule {}