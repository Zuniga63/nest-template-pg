import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './modules/common/common.module';
import { appConfig, EnvironmentVariables, JoiValidationSchema } from './config';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: JoiValidationSchema,
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'postgres',
        host: configService.get('database.host', { infer: true }),
        port: configService.get<number>('database.port', { infer: true }),
        username: configService.get('database.user', { infer: true }),
        password: configService.get('database.password', { infer: true }),
        database: configService.get('database.name', { infer: true }),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    CommonModule,

    AuthModule,

    UsersModule,

    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
