import { Controller, Get, Post, Body, Query, HttpException } from '@nestjs/common';
import { WordPairsService } from './word-pairs.service';
import { Language } from '../user/enums/Language.enum';

@Controller('word-pairs')
export class WordPairsController {
  constructor(private readonly wordPairsService: WordPairsService) {}

  @Get()
  async getWordPairs(
    @Query('sourceLanguage') sourceLanguage: string,
    @Query('targetLanguage') targetLanguage: string
  ) {
    try {
      console.log('Getting word pairs for languages:', sourceLanguage, targetLanguage);
      
      const sourceLangEnum = sourceLanguage?.toLowerCase() as Language;
      const targetLangEnum = targetLanguage?.toLowerCase() as Language;
      
      if (!sourceLangEnum || !targetLangEnum) {
        throw new HttpException('Source and target languages are required', 400);
      }
      
      if (!Object.values(Language).includes(sourceLangEnum) || 
          !Object.values(Language).includes(targetLangEnum)) {
        throw new HttpException('Invalid language code', 400);
      }

      return await this.wordPairsService.getGamePairs(sourceLangEnum, targetLangEnum);
    } catch (error) {
      console.error('Error getting word pairs:', error);
      throw error;
    }
  }

  @Post('seed')
  async seedWordPairs(
    @Query('sourceLanguage') sourceLanguage: string,
    @Query('targetLanguage') targetLanguage: string,
    @Body() wordPairs: Array<{ sourceWord: string; targetWord: string; correct: boolean; }>
  ) {
    try {
      console.log('Seeding word pairs for languages:', sourceLanguage, targetLanguage);
      
      const sourceLangEnum = sourceLanguage?.toLowerCase() as Language;
      const targetLangEnum = targetLanguage?.toLowerCase() as Language;
      
      if (!sourceLangEnum || !targetLangEnum) {
        throw new HttpException('Source and target languages are required', 400);
      }
      
      if (!Object.values(Language).includes(sourceLangEnum) || 
          !Object.values(Language).includes(targetLangEnum)) {
        throw new HttpException('Invalid language code', 400);
      }

      if (!Array.isArray(wordPairs) || wordPairs.length === 0) {
        throw new HttpException('Word pairs array is required in body', 400);
      }

      await this.wordPairsService.seedCustomWordPairs(sourceLangEnum, targetLangEnum, wordPairs);
      return { message: 'Word pairs seeded successfully' };
    } catch (error) {
      console.error('Error seeding word pairs:', error);
      throw error;
    }
  }
} 