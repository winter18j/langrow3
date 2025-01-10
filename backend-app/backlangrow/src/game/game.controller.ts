import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  /**
   * Crée un nouveau jeu.
   * POST /games
   */
  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  /**
   * Récupère tous les jeux.
   * GET /games
   */
  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  /**
   * Récupère un jeu par ID.
   * GET /games/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }
} 