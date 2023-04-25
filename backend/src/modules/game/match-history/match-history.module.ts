import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { MatchHistoryService } from './match-history.service';

@Module({
	imports: [TypeOrmModule.forFeature([MatchHistoryEntry])],
	providers: [MatchHistoryService],
	exports: [MatchHistoryService]
})
export class MatchHistoryModule {}
