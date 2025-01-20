import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { WordScrambleService } from './word-scramble.service';
import { Language } from '../user/enums/Language.enum';

interface SeedWordsDto {
  language: string;
  words: Array<{
    word: string;
    translation: string;
    difficulty: number;
    minLevel: number;
    timeAllowed: number;
  }>;
}

@Controller('word-scramble')
export class WordScrambleController {
  constructor(private readonly wordScrambleService: WordScrambleService) {}

  @Post('seed')
  async seedWords(@Body() data: SeedWordsDto) {
    try {
      console.log('Seeding word scramble words for language:', data.language);
      
      const langEnum = data.language?.toLowerCase() as Language;
      
      if (!langEnum) {
        throw new HttpException('Language is required', HttpStatus.BAD_REQUEST);
      }
      
      if (!Object.values(Language).includes(langEnum)) {
        throw new HttpException('Invalid language code', HttpStatus.BAD_REQUEST);
      }

      if (!Array.isArray(data.words) || data.words.length === 0) {
        throw new HttpException('Words array is required in body', HttpStatus.BAD_REQUEST);
      }

      await this.wordScrambleService.seedWords(langEnum, data.words);
      return { message: 'Word scramble words seeded successfully' };
    } catch (error) {
      console.error('Error seeding words:', error);
      throw error;
    }
  }

  @Get('words')
  async getWords(
    @Query('language') language: string,
    @Query('level') level: string,
    @Query('difficulty') difficulty?: string,
  ) {
    try {
      console.log('Getting word scramble words with params:', { language, level, difficulty });
      
      const langEnum = language?.toLowerCase() as Language;
      
      if (!langEnum) {
        throw new HttpException('Language is required', HttpStatus.BAD_REQUEST);
      }
      
      if (!Object.values(Language).includes(langEnum)) {
        throw new HttpException('Invalid language code', HttpStatus.BAD_REQUEST);
      }

      let words;
      if (difficulty) {
        const difficultyNum = parseInt(difficulty);
        if (isNaN(difficultyNum) || difficultyNum < 1 || difficultyNum > 5) {
          throw new HttpException('Difficulty must be between 1 and 5', HttpStatus.BAD_REQUEST);
        }
        words = await this.wordScrambleService.getWordsByDifficulty(langEnum, difficultyNum);
      } else {
        const playerLevel = parseInt(level);
        if (isNaN(playerLevel) || playerLevel < 1) {
          throw new HttpException('Valid player level is required', HttpStatus.BAD_REQUEST);
        }
        words = await this.wordScrambleService.getWordsByLevel(langEnum, playerLevel);
      }

      console.log('Returning words:', words);
      return words;
    } catch (error) {
      console.error('Error getting words:', error);
      throw error;
    }
  }
} 