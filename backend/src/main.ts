import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

let ioServer: Server | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  app.useGlobalPipes(new ValidationPipe({
	whitelist: true,
  }
  ));
  app.use(cookieParser());
  app.enableCors({
	origin: 'http://localhost:3000',
	credentials: true,
  });

  await app.listen(6969);
}

bootstrap()
