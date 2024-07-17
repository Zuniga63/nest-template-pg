import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compareSync } from 'bcrypt';

import { AuthLoginParams } from '../types';
import { CreateUserDto } from '../../users/dto';
import { SessionService } from './session.service';
import { UserDto } from '../../users/dto/user.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/JwtPayload.interface';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.getFullUser(username);
    if (!user || !compareSync(pass, user.password)) return null;

    delete user.password;
    return user;
  }

  async signin({ user, ip, userAgent }: AuthLoginParams) {
    const session = await this.sessionService.createSession({ user, ip, userAgent });
    const access_token = this.createAccessToken({ user, session_id: session.id });
    return { user: new UserDto(user), access_token };
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserDto(user);
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

  private createAccessToken({ user, session_id }: { user: User; session_id: string }) {
    const payload: JwtPayload = { sub: user.id, session_id };
    return this.jwtService.sign(payload);
  }
}
