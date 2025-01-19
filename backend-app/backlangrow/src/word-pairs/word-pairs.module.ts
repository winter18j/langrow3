import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WordPairsController } from './word-pairs.controller';
import { WordPairsService } from './word-pairs.service';
import { WordPair, WordPairSchema } from './schemas/word-pair.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WordPair.name, schema: WordPairSchema }]),
  ],
  controllers: [WordPairsController],
  providers: [WordPairsService],
})
export class WordPairsModule {} 