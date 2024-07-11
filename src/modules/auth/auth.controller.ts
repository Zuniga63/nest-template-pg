import { Controller, Post, Body, UseGuards, Get, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SwaggerTags } from 'src/config';
import { AuthResponseSchema } from './schemas/swagger.schema';
import { UserDto } from '../users/dto/user.dto';
import { ValidationErrorDto } from '../common/dto/validation-error.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ProfilePhotoDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../users/entities/user.entity';

@Controller('auth')
@ApiExtraModels(UserDto)
@ApiTags(SwaggerTags.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // * ----------------------------------------------------------------------------------------------------------------
  // * LOGIN LOCAL USER
  // * ----------------------------------------------------------------------------------------------------------------
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Login User',
    description: 'Public end point for get access token and user info',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    description: 'The user has been successfully login.',
    schema: AuthResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Email or password invalid.' })
  @Post('local/login')
  async localLogin(@GetUser() user: User) {
    return this.authService.loginUser(user);
  }

  // * ----------------------------------------------------------------------------------------------------------------
  // * REGISTER LOCAL USER
  // * ----------------------------------------------------------------------------------------------------------------
  @Post('local/register')
  @ApiOperation({
    summary: 'Register user',
    description: 'Public end point for create the user and return access token',
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    schema: AuthResponseSchema,
  })
  @ApiBadRequestResponse({
    description: 'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  localRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  // * ----------------------------------------------------------------------------------------------------------------
  // * PROFILE
  // * ----------------------------------------------------------------------------------------------------------------
  @Get('profile')
  @Auth()
  @ApiOperation({
    summary: 'Get user profile',
    description: 'This end recover the info of one user',
  })
  @ApiOkResponse({
    description: 'User Info',
    // type: UserDto,
  })
  getProfile(@GetUser() user: User) {
    return new UserDto(user);
  }

  @Auth()
  @Post('profile/photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ProfilePhotoDto })
  @ApiOkResponse({
    description: 'User Info',
    type: UserDto,
  })
  @ApiBadRequestResponse({ description: 'The image can not uploaded' })
  updateProfilePhoto(@UploadedFile() file: Express.Multer.File, @GetUser() user: User) {
    return this.authService.updateProfilePhoto(user, file);
  }

  @Auth()
  @Delete('profile/photo')
  @ApiOperation({ summary: 'Delete user profile photo', description: 'This end point delete the user profile photo' })
  @ApiOkResponse({
    description: 'User Info',
    type: UserDto,
  })
  @ApiBadRequestResponse({ description: 'The image can not deleted' })
  destroyProfilePhoto(@GetUser() user: User) {
    return this.authService.destroyProfilePhoto(user);
  }
}
