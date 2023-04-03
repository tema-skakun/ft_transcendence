import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  app.useGlobalPipes(new ValidationPipe({
	whitelist: true,
  }
  ));
  app.use(cookieParser());
  app.enableCors({
	origin: ['http://localhost:3000'],
  });
  await app.listen(3333);
}
bootstrap();
