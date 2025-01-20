import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WordScramble, WordScrambleDocument } from './schemas/word-scramble.schema';
import { Language } from '../user/enums/Language.enum';

@Injectable()
export class WordScrambleService {
  constructor(
    @InjectModel(WordScramble.name) private wordScrambleModel: Model<WordScrambleDocument>,
  ) {}

  async seedWords(language: Language, words: Array<Partial<WordScramble>>): Promise<void> {
    try {
      // First, check if words already exist for this language
      const existingWords = await this.wordScrambleModel.find({ language }).exec();
      if (existingWords.length > 0) {
        // Delete existing words for this language
        await this.wordScrambleModel.deleteMany({ language });
      }

      // Create all words in the database
      for (const word of words) {
        const newWord = new this.wordScrambleModel({
          ...word,
          language
        });
        await newWord.save();
      }

      console.log('Word scramble words seeded successfully');
    } catch (error) {
      console.error('Error seeding word scramble words:', error);
      throw new HttpException(
        `Failed to seed words: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getWordsByLevel(language: Language, playerLevel: number): Promise<WordScramble[]> {
    try {
      // Get words that match the player's level or below
      // Sort by difficulty to ensure a good mix
      return await this.wordScrambleModel
        .find({
          language,
          minLevel: { $lte: playerLevel }
        })
        .sort({ difficulty: 1 })
        .exec();
    } catch (error) {
      console.error('Error getting words:', error);
      throw new HttpException(
        `Failed to get words: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getWordsByDifficulty(language: Language, difficulty: number): Promise<WordScramble[]> {
    try {
      return await this.wordScrambleModel
        .find({
          language,
          difficulty
        })
        .exec();
    } catch (error) {
      console.error('Error getting words by difficulty:', error);
      throw new HttpException(
        `Failed to get words: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 