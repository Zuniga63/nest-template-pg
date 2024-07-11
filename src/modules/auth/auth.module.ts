import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { EnvironmentVariables } from 'src/config';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy, JwtStrategy } from './strategies';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    UsersModule,

    PassportModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables>) => ({
        secret: config.get('jwt.secret', { infer: true }),
        signOptions: { expiresIn: config.get('jwt.expiresIn', { infer: true }) },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController, ProfileController],
})
export class AuthModule {}
