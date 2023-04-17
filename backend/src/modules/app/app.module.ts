import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from '../game/game.gateway';
import { GameService } from '../game/gameService';
import { RelationalTable } from '../../tools/converter';
import { DebugModule } from '../../debug/debug.module';
import { Accessor } from '../game/game.gateway';

import { UserRestriction } from '../../classes/UserRestriction'
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { twoFactorAuthModule } from '../auth/twoFactorAuth/twoFactorAuth.module';
import { Forty2Strategy } from 'src/GuardStrategies/42.strategy';
import { TwoFactorAuthenticationService } from '../auth/twoFactorAuth/twoFactorAuth.service';
import { JwtTwoFactorStrategy } from 'src/GuardStrategies/Jwt2F.strategy';
import { JWTStrategy } from 'src/GuardStrategies/JWT.strategy';
import entities from 'src/entities/index';



@Module({
  imports: [ AuthModule, UserModule, UserModule, twoFactorAuthModule,
	JwtModule,
	ConfigModule.forRoot({isGlobal: true }),

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
	DebugModule,
	],
  controllers: [],
  providers: [UserRestriction, Accessor, RelationalTable, GameGateway, GameService,
	Forty2Strategy, TwoFactorAuthenticationService, JwtTwoFactorStrategy, JWTStrategy],
})
export class AppModule {}

