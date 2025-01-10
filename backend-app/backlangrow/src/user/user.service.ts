import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GeoLocation } from './interfaces/location.interface';
import { League } from './enums/league.enum';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { Game } from '../game/schemas/game.schema';
import { CreateGameDto } from '../game/dto/create-game.dto';
import { GameService } from '../game/game.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private gameService: GameService
  ) {
    try {
      initializeApp({
        credential: cert(require('../../../firebase-admin-key.json')),
      });
    } catch (error) {
      console.error('Erreur d\'initialisation Firebase:', error);
    }
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<UserDocument> {
    console.log('Début updateFcmToken');
    console.log('userId:', userId);
    console.log('fcmToken:', fcmToken);
    
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        console.error('Utilisateur non trouvé');
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      console.log('Utilisateur trouvé:', user._id);
      console.log('Ancien token:', user.fcmToken);

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: { fcmToken: fcmToken } },
        { new: true, runValidators: true }
      ).exec();

      if (!updatedUser) {
        throw new Error('La mise à jour a échoué');
      }

      console.log('Token FCM mis à jour avec succès');
      console.log('Nouveau token:', updatedUser.fcmToken);
      
      return updatedUser;
    } catch (error) {
      console.error('Erreur complète lors de la mise à jour du token FCM:', error);
      if (error.name === 'ValidationError') {
        console.error('Erreur de validation:', error.errors);
      }
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { nickname: createUserDto.nickname }
      ]
    });

    if (existingUser) {
      throw new ConflictException('Email or nickname already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const [lat, lng] = createUserDto.location.split(',').map(Number);
    
    const geoLocation: GeoLocation = {
      type: 'Point',
      coordinates: [lng, lat]
    };

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      location: geoLocation
    });

    return newUser.save();
  }

  async sendGameUnlockNotification(userId: string, newLeague: League): Promise<void> {
    try {
      const user = await this.findOne(userId);
      console.log(`Envoi de notification pour l'utilisateur ${userId} avec la ligue ${newLeague}`);
      
      if (!user.fcmToken) {
        console.log('Pas de token FCM pour l\'utilisateur');
        return;
      }

      const unlockedGames = this.getUnlockedGamesForLeague(newLeague);
      console.log('Jeux débloqués:', unlockedGames);
      
      if (unlockedGames.length > 0) {
        const message = {
          token: user.fcmToken,
          notification: {
            title: '🎮 Nouveaux jeux débloqués !',
            body: `Félicitations ! Vous avez atteint la ligue ${newLeague} et débloqué ${unlockedGames.length} nouveau(x) jeu(x) !`
          },
          data: {
            type: 'GAME_UNLOCK',
            league: newLeague,
            unlockedGames: JSON.stringify(unlockedGames)
          }
        };
        
        console.log('Message de notification:', message);
        
        const response = await getMessaging().send(message);
        console.log('Notification envoyée avec succès:', response);
      }
    } catch (error) {
      console.error('Erreur détaillée lors de l\'envoi de la notification:', error);
      if (error.errorInfo) {
        console.error('Firebase Error Info:', error.errorInfo);
      }
    }
  }

  private getUnlockedGamesForLeague(league: League): string[] {
    const games = [];
    switch (league) {
      case League.BRONZE:
        games.push('Mot à Image');
        break;
      case League.SILVER:
        games.push('Mot à Mot');
        break;
      case League.GOLD:
        games.push('Phrases à Trous');
        break;
      case League.PLATINUM:
        games.push('Quiz Avancé');
        break;
      case League.DIAMOND:
        games.push('Conversation AI');
        break;
    }
    return games;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    let update: any = { ...updateUserDto };

    if (updateUserDto.password) {
      update.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.location) {
      const [lat, lng] = updateUserDto.location.split(',').map(Number);
      update.location = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async updateGameStats(
    id: string,
    xpGained: number,
    timeSpent: number
  ): Promise<UserDocument> {
    const user = await this.findOne(id);
    const oldLeague = user.league;
    
    user.xpToNextLevel += xpGained;
    if (user.xpToNextLevel >= 100 * user.level) {
      user.level += 1;
      user.xpToNextLevel = 0;
      
      let newLeague = user.league;
      if (user.level >= 50) newLeague = League.MASTER;
      else if (user.level >= 40) newLeague = League.DIAMOND;
      else if (user.level >= 30) newLeague = League.PLATINUM;
      else if (user.level >= 20) newLeague = League.GOLD;
      else if (user.level >= 10) newLeague = League.SILVER;

      if (newLeague !== oldLeague) {
        user.league = newLeague;
        await this.sendGameUnlockNotification(id, newLeague);
      }
    }

    user.timeSpentLearning += timeSpent;
    return user.save();
  }

  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async cheatLevelUp(userId: string): Promise<UserDocument> {
    console.log('Début cheatLevelUp pour userId:', userId);
    const user = await this.findOne(userId);
    console.log('Niveau actuel:', user.level, 'Ligue actuelle:', user.league);
    const oldLeague = user.league;
    
    user.level += 20;
    console.log('Nouveau niveau:', user.level);
    
    if (user.level >= 50) user.league = League.MASTER;
    else if (user.level >= 40) user.league = League.DIAMOND;
    else if (user.level >= 30) user.league = League.PLATINUM;
    else if (user.level >= 20) user.league = League.GOLD;
    else if (user.level >= 10) user.league = League.SILVER;
    
    console.log('Nouvelle ligue:', user.league);

    if (user.league !== oldLeague) {
      console.log('Changement de ligue détecté, envoi de notification...');
      await this.sendGameUnlockNotification(userId, user.league);
    } else {
      console.log('Pas de changement de ligue, aucune notification envoyée');
    }

    const savedUser = await user.save();
    console.log('Utilisateur sauvegardé avec succès');
    return savedUser;
  }

  async resetLevel(userId: string): Promise<UserDocument> {
    const user = await this.findOne(userId);
    const oldLeague = user.league;
    
    user.level = 1;
    user.xpToNextLevel = 0;
    user.league = League.BRONZE;

    if (user.league !== oldLeague) {
      await this.sendGameUnlockNotification(userId, user.league);
    }

    return user.save();
  }

  async addGameToUser(userId: string, gameId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    const game = await this.gameService.findOne(gameId);
    if (!game) {
      throw new NotFoundException(`Jeu avec l'ID ${gameId} non trouvé`);
    }

    user.games.push(new Types.ObjectId(gameId));
    return user.save();
  }

  async getUserGames(userId: string): Promise<Game[]> {
    const user = await this.userModel.findById(userId).populate('games').exec();
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    return user.games as unknown as Game[];
  }

  /**
   * Envoie une notification de test à l'utilisateur.
   * @param userId ID de l'utilisateur
   */
  async sendTestNotification(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.fcmToken) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} ou son token FCM non trouvé`);
    }

    const message = {
      token: user.fcmToken,
      notification: {
        title: 'Test de Notification',
        body: 'Ceci est une notification de test.',
      },
      data: {
        type: 'TEST',
      },
    };

    try {
      const response = await getMessaging().send(message);
      console.log('Notification de test envoyée avec succès:', response);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de test:', error);
    }
  }
}