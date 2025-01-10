import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.userService.create(createUserDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
      return this.userService.findAll();
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.userService.findOne(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(id, updateUserDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Patch(':id/game-stats')
    updateGameStats(
      @Param('id') id: string,
      @Body('xpGained') xpGained: number,
      @Body('timeSpent') timeSpent: number
    ) {
      return this.userService.updateGameStats(id, xpGained, timeSpent);
    }
  
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.userService.remove(id);
    }
  
    @Post(':id/fcm-token')
    @UseGuards(JwtAuthGuard)
    async updateFcmToken(
      @Param('id') id: string,
      @Body('token') token: string
    ) {
      try {
        console.log('Réception de la demande de mise à jour du token FCM');
        console.log('ID utilisateur:', id);
        console.log('Token reçu:', token);
        
        if (!token) {
          throw new Error('Token FCM manquant');
        }

        const result = await this.userService.updateFcmToken(id, token);
        console.log('Mise à jour réussie, résultat:', result);
        return result;
      } catch (error) {
        console.error('Erreur dans le contrôleur updateFcmToken:', error);
        throw error;
      }
    }
  
    @Post(':id/cheat-level')
    @UseGuards(JwtAuthGuard)
    async cheatLevelUp(@Param('id') id: string) {
      console.log('Appel à cheatLevelUp reçu pour id:', id);
      const result = await this.userService.cheatLevelUp(id);
      console.log('Résultat cheatLevelUp:', { level: result.level, league: result.league });
      return result;
    }

    @Post(':id/reset-level')
    @UseGuards(JwtAuthGuard)
    async resetLevel(@Param('id') id: string) {
      return this.userService.resetLevel(id);
    }

    /**
     * Ajoute un jeu à l'utilisateur.
     * POST /users/:id/games
     */
    @Post(':id/games')
    addGame(@Param('id') id: string, @Body('gameId') gameId: string) {
      return this.userService.addGameToUser(id, gameId);
    }

    /**
     * Récupère les jeux d'un utilisateur.
     * GET /users/:id/games
     */
    @Get(':id/games')
    getGames(@Param('id') id: string) {
      return this.userService.getUserGames(id);
    }

    /**
     * Envoie une notification de test à l'utilisateur.
     * POST /users/:id/send-test-notification
     */
    @Post(':id/send-test-notification')
    sendTestNotification(@Param('id') id: string) {
      return this.userService.sendTestNotification(id);
    }
  }