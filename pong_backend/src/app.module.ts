import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './gameService';
import { RelationalTable } from './converter';

@Module({
	providers: [RelationalTable, GameGateway, GameService],
})
export class AppModule {}
