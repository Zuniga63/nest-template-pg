import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards';
import { UsersService } from './users.service';
import { SecureUser } from './interfaces/secure-user.interface';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@GetUser() user: SecureUser) {
    return user;
  }
}
