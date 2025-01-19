import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Language } from '../../user/enums/Language.enum';

export type WordPairDocument = WordPair & Document;

@Schema()
export class WordPair {
  @Prop({ required: true })
  sourceWord: string;

  @Prop({ required: true })
  targetWord: string;

  @Prop({ required: true })
  correct: boolean;

  @Prop({ required: true, enum: Language })
  sourceLanguage: Language;

  @Prop({ required: true, enum: Language })
  targetLanguage: Language;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WordPairSchema = SchemaFactory.createForClass(WordPair); 