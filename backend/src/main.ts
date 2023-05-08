import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

if (!process.env.FRONTEND_URL) {
	  throw new Error('FRONTEND_URL is not set in .env file');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  app.useGlobalPipes(new ValidationPipe({
	whitelist: true,
  }
  ));
  app.use(cookieParser());
  app.enableCors({
	origin: process.env.FRONTEND_URL,
	credentials: true,
  });

  await app.listen(6969, '0.0.0.0');
}

bootstrap()
