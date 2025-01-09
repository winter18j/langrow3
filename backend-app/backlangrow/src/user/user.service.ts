import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GeoLocation } from './interfaces/location.interface';
import { League } from './enums/league.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

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
    
    user.xpToNextLevel += xpGained;
    if (user.xpToNextLevel >= 100 * user.level) {
      user.level += 1;
      user.xpToNextLevel = 0;
      
      if (user.level >= 50) user.league = League.MASTER;
      else if (user.level >= 40) user.league = League.DIAMOND;
      else if (user.level >= 30) user.league = League.PLATINUM;
      else if (user.level >= 20) user.league = League.GOLD;
      else if (user.level >= 10) user.league = League.SILVER;
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
}