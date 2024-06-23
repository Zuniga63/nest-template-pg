import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
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
  async localLogin(@Request() req: any) {
    return this.authService.loginUser(req.user);
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
}
