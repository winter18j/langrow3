import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WordPair, WordPairDocument } from './schemas/word-pair.schema';
import { Language } from '../user/enums/Language.enum';

@Injectable()
export class WordPairsService {
  constructor(
    @InjectModel(WordPair.name) private wordPairModel: Model<WordPairDocument>,
  ) {}

  async findByLanguages(sourceLanguage: Language, targetLanguage: Language): Promise<WordPair[]> {
    return this.wordPairModel.find({
      sourceLanguage,
      targetLanguage
    }).exec();
  }

  async createWordPair(wordPair: Partial<WordPair>): Promise<WordPair> {
    const createdPair = new this.wordPairModel(wordPair);
    return createdPair.save();
  }

  async seedCustomWordPairs(
    sourceLanguage: Language, 
    targetLanguage: Language, 
    wordPairs: Array<{ sourceWord: string; targetWord: string; correct: boolean; }>
  ): Promise<void> {
    try {
      // First, check if pairs already exist for these languages
      const existingPairs = await this.findByLanguages(sourceLanguage, targetLanguage);
      if (existingPairs.length > 0) {
        // Delete existing pairs for these languages
        await this.wordPairModel.deleteMany({ sourceLanguage, targetLanguage });
      }

      // Create all pairs in the database
      for (const pair of wordPairs) {
        await this.createWordPair({
          ...pair,
          sourceLanguage,
          targetLanguage
        });
      }

      console.log('Word pairs seeded successfully');
    } catch (error) {
      console.error('Error seeding word pairs:', error);
      throw new HttpException(
        `Failed to seed word pairs: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getGamePairs(sourceLanguage: Language, targetLanguage: Language): Promise<WordPair[]> {
    try {
      // Get all pairs for these languages
      const pairs = await this.findByLanguages(sourceLanguage, targetLanguage);
      
      if (pairs.length === 0) {
        throw new HttpException(
          'No word pairs found for these languages. Please seed the data first.',
          HttpStatus.NOT_FOUND
        );
      }

      return pairs;
    } catch (error) {
      console.error('Error getting game pairs:', error);
      throw error;
    }
  }
} 