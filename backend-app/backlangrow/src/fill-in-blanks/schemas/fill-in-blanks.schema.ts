import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Language } from '../../user/enums/Language.enum';

export type FillInBlanksDocument = HydratedDocument<FillInBlanks>;

@Schema()
export class FillInBlanks {
  @Prop({ required: true })
  sentence: string;

  @Prop({ required: true })
  missingWord: string;

  @Prop({ required: true })
  options: string[];

  @Prop({ required: true, enum: Language })
  language: Language;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FillInBlanksSchema = SchemaFactory.createForClass(FillInBlanks); 