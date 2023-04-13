import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from '../game/game.gateway';
import { GameService } from '../game/gameService';
import { RelationalTable } from '../../tools/converter';
import { DebugModule } from '../../debug/debug.module';
import { Accessor } from '../game/game.gateway';



@Module({
  imports: [ JwtModule.register({
	secret: 'qwerty',
	signOptions: { expiresIn: '7d' },
  }),
	ConfigModule.forRoot({ isGlobal: true }),

	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: (configService: ConfigService) => ({
		  type: 'postgres',
		  host: configService.get('DB_HOST'),
		  port: configService.get<number>('DB_PORT'),
		  username: configService.get('POSTGRES_USER'),
		  password: configService.get('POSTGRES_PASSWORD'),
		  database: configService.get('POSTGRES_DB'),
		  entities: [],
		  synchronize: true,
		}),
		inject: [ConfigService],
	  }),
	DebugModule,
	],
  controllers: [],
  providers: [Accessor, RelationalTable, GameGateway, GameService],
})
export class AppModule {}

