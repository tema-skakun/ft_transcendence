import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import entities from './typeorm';
import { TypeormModule } from './typeorm/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Forty2Strategy } from './42/42.strategy';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { SocketioGateway } from './socketio.gateway';
import { AuthService } from "./auth/auth.service";
import { AuthenticationService } from './authentication.service';


@Module({
  imports: [AuthModule, UserModule, TypeormModule, UserModule, JwtModule.register({
	secret: 'qwerty',
	signOptions: { expiresIn: '7d' },
  }),
	ConfigModule.forRoot({ isGlobal: true }),
	// ServeStaticModule.forRoot({
	// 	rootPath: join(__dirname, '..', 'build'),
	// }),
	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: (configService: ConfigService) => ({
		  type: 'postgres',
		  host: configService.get('DB_HOST'),
		  port: +configService.get<number>('DB_PORT'),
		  username: configService.get('POSTGRES_USER'),
		  password: configService.get('POSTGRES_PASSWORD'),
		  database: configService.get('POSTGRES_DB'),
		  entities: entities,
		  synchronize: true,
		}),
		inject: [ConfigService],
	  }),
	],
  controllers: [AppController],
  providers: [AuthenticationService, AuthService, SocketioGateway, AppService, Forty2Strategy],
})
export class AppModule {}

