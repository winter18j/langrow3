import { IsEmail, IsString, MinLength, IsEnum, IsLatLong, Matches } from 'class-validator';
import { Language } from '../../user/enums/language.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 upper case letter, 1 lower case letter, and 1 number or special character',
  })
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