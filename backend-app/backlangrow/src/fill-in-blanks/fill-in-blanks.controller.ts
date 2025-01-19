import { Controller, Get, Post, Body, Query, HttpException } from '@nestjs/common';
import { FillInBlanksService } from './fill-in-blanks.service';
import { Language } from '../user/enums/Language.enum';

@Controller('fill-in-blanks')
export class FillInBlanksController {
  constructor(private readonly fillInBlanksService: FillInBlanksService) {}

  @Get()
  async getSentences(@Query('language') language: string) {
    try {
      console.log('Getting fill in blanks sentences for language:', language);
      
      const langEnum = language?.toLowerCase() as Language;
      
      if (!langEnum) {
        throw new HttpException('Language is required', 400);
      }
      
      if (!Object.values(Language).includes(langEnum)) {
        throw new HttpException('Invalid language code', 400);
      }

      return await this.fillInBlanksService.getGameSentences(langEnum);
    } catch (error) {
      console.error('Error getting sentences:', error);
      throw error;
    }
  }

  @Post('seed')
  async seedSentences(
    @Query('language') language: string,
    @Body() sentences: Array<{ sentence: string; missingWord: string; options: string[]; }>
  ) {
    try {
      console.log('Seeding fill in blanks sentences for language:', language);
      
      const langEnum = language?.toLowerCase() as Language;
      
      if (!langEnum) {
        throw new HttpException('Language is required', 400);
      }
      
      if (!Object.values(Language).includes(langEnum)) {
        throw new HttpException('Invalid language code', 400);
      }

      if (!Array.isArray(sentences) || sentences.length === 0) {
        throw new HttpException('Sentences array is required in body', 400);
      }

      await this.fillInBlanksService.seedCustomSentences(langEnum, sentences);
      return { message: 'Fill in blanks sentences seeded successfully' };
    } catch (error) {
      console.error('Error seeding sentences:', error);
      throw error;
    }
  }
} 