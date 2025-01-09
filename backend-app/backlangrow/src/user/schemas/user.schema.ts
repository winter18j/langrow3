import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { League } from '../enums/league.enum';
import { Language } from '../enums/language.enum';
import { GeoLocation } from '../interfaces/location.interface';

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
}

export const UserSchema = SchemaFactory.createForClass(User);