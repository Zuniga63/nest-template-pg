import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { appConfig, validationPipeConfig } from './config';
import { AllExceptionsFilter } from './modules/common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const { http } = appConfig();

  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Se global validation pipe
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  // Set global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  await app.listen(http.port);
  logger.log(`Application listening on ${http.host}:${http.port}`);
}
bootstrap();
