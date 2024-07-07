import { Controller, Get } from '@nestjs/common';

import { UsersService } from './users.service';
import { SecureUser } from './interfaces/secure-user.interface';
import { GetUser } from '../common/decorators/get-user.decorator';
import { SwaggerTags } from 'src/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { Auth } from '../auth/decorators';

@Controller('users')
@ApiTags(SwaggerTags.Users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // * ----------------------------------------------------------------------------------------------------------------
  // * GET PROFILE
  // * ----------------------------------------------------------------------------------------------------------------
  @Get('/profile')
  @Auth()
  @ApiOperation({
    summary: 'Get user profile',
    description: 'This end recover the info of one user',
  })
  @ApiOkResponse({
    description: 'User Info',
    type: UserDto,
  })
  getProfile(@GetUser() user: SecureUser) {
    return user;
  }
}
