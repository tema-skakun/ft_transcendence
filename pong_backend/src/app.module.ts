import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './gameService';
import { Converter } from './converter';

@Module({
	providers: [Converter, GameGateway, GameService],
})
export class AppModule {}
