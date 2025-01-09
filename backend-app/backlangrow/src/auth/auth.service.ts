import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const userObject = user.toObject();
      const { password: _, ...result } = userObject;
      return result;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload = { email: user.email, sub: user._id };
    let userObject: any;
    if (typeof user.toObject === 'function') {
      userObject = user.toObject();
    } else {
      // i honestly don't know why this is necessary
      userObject = user;
    }
    const { password: _, ...userData } = userObject;
    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    const userObject = user.toObject();
    const { password: _, ...result } = userObject;
    return result;
  }
}