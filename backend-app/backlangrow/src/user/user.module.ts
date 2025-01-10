import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { Game, GameSchema } from '../game/schemas/game.schema';
import { GameModule } from '../game/game.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Game.name, schema: GameSchema },
    ]),
    GameModule,
  ],  
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}