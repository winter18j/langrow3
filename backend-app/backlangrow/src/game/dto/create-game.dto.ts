import { IsString, IsOptional } from 'class-validator';

export class CreateGameDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  // Ajoutez d'autres propriétés si nécessaire
} 