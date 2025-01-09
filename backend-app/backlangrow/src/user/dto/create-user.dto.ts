import { IsEmail, IsString, MinLength, IsEnum, IsLatLong } from 'class-validator';
import { Language } from '../enums/language.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @MinLength(3)
  nickname: string;

  @IsString()
  @IsLatLong()
  location: string;

  @IsEnum(Language)
  mainLanguage: Language;

  @IsEnum(Language)
  learnedLanguage: Language;
}