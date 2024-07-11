import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compareSync } from 'bcrypt';

import { CreateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/JwtPayload.interface';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.getFullUser(username);
    if (!user || !compareSync(pass, user.password)) return null;

    delete user.password;
    return user;
  }

  async loginUser(user: User) {
    const access_token = this.getAccessToken(user);

    return { user: new UserDto(user), access_token };
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.loginUser(user);
  }

  async updateProfilePhoto(user: User, file: Express.Multer.File) {
    return this.usersService.updateProfilePhoto(user.id, file);
  }

  async destroyProfilePhoto(user: User) {
    return this.usersService.removeProfilePhoto(user.id);
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(user.email, changePasswordDto);
  }

  private getAccessToken(user: User) {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.sign(payload);
  }
}
