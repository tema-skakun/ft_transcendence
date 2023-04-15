import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import entities from './typeorm';
import { TypeormModule } from './typeorm/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Forty2Strategy } from './GuardStrategies/42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TwoFactorAuthenticationService } from './auth/twoFactorAuth/twoFactorAuth.service';
import { JWTStrategy } from './GuardStrategies/JWT.strategy';
import { twoFactorAuthModule } from './auth/twoFactorAuth/twoFactorAuth.module';
import { JwtTwoFactorStrategy } from './GuardStrategies/Jwt2F.strategy';



@Module({
  imports: [AuthModule, UserModule, TypeormModule, UserModule, twoFactorAuthModule,
	JwtModule,
	ConfigModule.forRoot({ isGlobal: true }),
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
  providers: [AppService, Forty2Strategy, TwoFactorAuthenticationService, JwtTwoFactorStrategy, JWTStrategy],
})
export class AppModule {}

