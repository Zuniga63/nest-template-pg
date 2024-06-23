import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerTags } from './swagger-tags.enum';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Nest Auth Template')
  .setDescription('This is an API for managment the auth users')
  .setVersion('1.0')
  .addTag(SwaggerTags.Auth, 'End point for register and login')
  .addTag(SwaggerTags.Users, 'Route for user administration')
  .addBearerAuth()
  .build();
