import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards';
import { UsersService } from './users.service';
import { SecureUser } from './interfaces/secure-user.interface';
import { GetUser } from '../common/decorators/get-user.decorator';
import { SwaggerTags } from 'src/config';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@Controller('users')
@ApiTags(SwaggerTags.Users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // * ----------------------------------------------------------------------------------------------------------------
  // * GET PROFILE
  // * ----------------------------------------------------------------------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'This end recover the info of one user',
  })
  @ApiOkResponse({
    description: 'User Info',
    type: UserDto,
  })
  @ApiBearerAuth()
  getProfile(@GetUser() user: SecureUser) {
    return user;
  }
}
