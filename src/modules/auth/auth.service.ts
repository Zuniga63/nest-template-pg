import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compareSync } from 'bcrypt';

import { CreateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/JwtPayload.interface';
import { SecureUser } from '../users/interfaces/secure-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.getFullUser(username);
    if (!user || !compareSync(pass, user.password)) return null;

    delete user.password;
    return user;
  }

  async loginUser(user: SecureUser) {
    const access_token = this.getAccessToken(user);

    return { user, access_token };
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.loginUser(user);
  }

  private getAccessToken(user: SecureUser) {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.sign(payload);
  }
}
