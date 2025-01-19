import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional } from 'class-validator';
import { Language } from '../enums/Language.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  mainLanguage?: Language;

  @IsOptional()
  learnedLanguage?: Language;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  fcmToken?: string;
}