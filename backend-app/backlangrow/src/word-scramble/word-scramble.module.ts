import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WordScrambleController } from './word-scramble.controller';
import { WordScrambleService } from './word-scramble.service';
import { WordScramble, WordScrambleSchema } from './schemas/word-scramble.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WordScramble.name, schema: WordScrambleSchema }]),
  ],
  controllers: [WordScrambleController],
  providers: [WordScrambleService],
})
export class WordScrambleModule {} 