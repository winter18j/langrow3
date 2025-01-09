import { Exclude, Expose } from 'class-transformer';
import { League } from '../enums/league.enum';
import { Language } from '../enums/language.enum';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  nickname: string;

  @Expose()
  location: {
    type: string;
    coordinates: number[];
  };

  @Expose()
  level: number;

  @Expose()
  xpToNextLevel: number;

  @Expose()
  ladderRank: number;

  @Expose()
  league: League;

  @Expose()
  mainLanguage: Language;

  @Expose()
  learnedLanguage: Language;

  @Expose()
  timeSpentLearning: number;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}