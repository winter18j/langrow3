import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  // Ajoutez d'autres propriétés pertinentes pour le jeu
}

export const GameSchema = SchemaFactory.createForClass(Game); 