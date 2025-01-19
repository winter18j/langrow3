import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FillInBlanks, FillInBlanksDocument } from './schemas/fill-in-blanks.schema';
import { Language } from '../user/enums/Language.enum';

@Injectable()
export class FillInBlanksService {
  constructor(
    @InjectModel(FillInBlanks.name) private fillInBlanksModel: Model<FillInBlanksDocument>,
  ) {}

  async findByLanguage(language: Language): Promise<FillInBlanks[]> {
    return this.fillInBlanksModel.find({ language }).exec();
  }

  async createSentence(sentence: Partial<FillInBlanks>): Promise<FillInBlanks> {
    const createdSentence = new this.fillInBlanksModel(sentence);
    return createdSentence.save();
  }

  async seedCustomSentences(
    language: Language,
    sentences: Array<{ sentence: string; missingWord: string; options: string[]; }>
  ): Promise<void> {
    try {
      // First, check if sentences already exist for this language
      const existingSentences = await this.findByLanguage(language);
      if (existingSentences.length > 0) {
        // Delete existing sentences for this language
        await this.fillInBlanksModel.deleteMany({ language });
      }

      // Create all sentences in the database
      for (const sentence of sentences) {
        await this.createSentence({
          ...sentence,
          language
        });
      }

      console.log('Fill in blanks sentences seeded successfully');
    } catch (error) {
      console.error('Error seeding fill in blanks sentences:', error);
      throw new HttpException(
        `Failed to seed sentences: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getGameSentences(language: Language): Promise<FillInBlanks[]> {
    try {
      // Get all sentences for this language
      const sentences = await this.findByLanguage(language);
      
      if (sentences.length === 0) {
        throw new HttpException(
          'No sentences found for this language. Please seed the data first.',
          HttpStatus.NOT_FOUND
        );
      }

      return sentences;
    } catch (error) {
      console.error('Error getting game sentences:', error);
      throw error;
    }
  }
} 