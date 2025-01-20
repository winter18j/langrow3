import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Language } from '../../user/enums/Language.enum';

export type WordScrambleDocument = HydratedDocument<WordScramble>;

@Schema()
export class WordScramble {
  @Prop({ required: true })
  word: string;

  @Prop({ required: true })
  translation: string;

  @Prop({ required: true, min: 1, max: 5 })
  difficulty: number;

  @Prop({ required: true, enum: Language })
  language: Language;

  @Prop({ required: true })
  minLevel: number;

  @Prop({ required: true })
  timeAllowed: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WordScrambleSchema = SchemaFactory.createForClass(WordScramble); 