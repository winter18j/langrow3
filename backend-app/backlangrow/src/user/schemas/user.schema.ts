import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { League } from '../enums/league.enum';
import { Language } from '../enums/language.enum';
import { GeoLocation } from '../interfaces/location.interface';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'], 
      required: true,
    },
    coordinates: {
      type: [Number], 
      required: true,
    },
  })
  location: {
    type: string; 
    coordinates: [number, number]; 
  };

  @Prop({ required: true, default: 1 })
  level: number;

  @Prop({ required: true, default: 0 })
  xpToNextLevel: number;

  @Prop({ required: true, default: 0 })
  ladderRank: number;

  @Prop({ required: true, enum: League, default: League.BRONZE })
  league: League;

  @Prop({ required: true, enum: Language })
  mainLanguage: Language;

  @Prop({ required: true, enum: Language })
  learnedLanguage: Language;

  @Prop({ required: true, default: 0 })
  timeSpentLearning: number;

  @Prop({ default: 0 })
  xp: number;

  @Prop({ default: 0 })
  coins: number;

  @Prop({ type: [{ 
    id: String,
    quantity: { type: Number, default: 0 }
  }], default: [] })
  ownedPowerUps: Array<{
    id: string;
    quantity: number;
  }>;

  @Prop({ default: 0 })
  totalTimeSpent: number;

  @Prop({ default: 0 })
  totalGamesPlayed: number;

  @Prop({ default: 0 })
  totalGamesWon: number;

  @Prop({ default: 0 })
  totalGamesLost: number;

  @Prop({ default: 0 })
  winStreak: number;

  @Prop({ default: 0 })
  bestWinStreak: number;

  @Prop({ default: 0 })
  totalXpGained: number;

  @Prop({ default: 0 })
  totalXpLost: number;

  @Prop({ default: 0 })
  totalXpSpent: number;

  @Prop({ default: 0 })
  totalXpEarned: number;

  @Prop({ default: 0 })
  totalXpBalance: number;

  @Prop({ default: 0 })
  totalXpGainedToday: number;

  @Prop({ default: 0 })
  totalXpLostToday: number;

  @Prop({ default: 0 })
  totalXpSpentToday: number;

  @Prop({ default: 0 })
  totalXpEarnedToday: number;

  @Prop({ default: 0 })
  totalXpBalanceToday: number;

  @Prop({ default: 0 })
  totalTimeSpentToday: number;

  @Prop({ default: 0 })
  totalGamesPlayedToday: number;

  @Prop({ default: 0 })
  totalGamesWonToday: number;

  @Prop({ default: 0 })
  totalGamesLostToday: number;

  @Prop({ default: 0 })
  winStreakToday: number;

  @Prop({ default: 0 })
  bestWinStreakToday: number;

  @Prop({ default: Date.now })
  lastActive: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: null })
  fcmToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);