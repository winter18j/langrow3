import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './schemas/game.schema';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  /**
   * Crée un nouveau jeu.
   * @param createGameDto DTO de création de jeu
   */
  async create(createGameDto: CreateGameDto): Promise<Game> {
    const newGame = new this.gameModel(createGameDto);
    return newGame.save();
  }

  /**
   * Récupère tous les jeux.
   */
  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  /**
   * Récupère un jeu par ID.
   * @param id ID du jeu
   */
  async findOne(id: string): Promise<Game> {
    const game = await this.gameModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException(`Jeu avec l'ID ${id} non trouvé`);
    }
    return game;
  }

  // ... autres méthodes si nécessaire
} 