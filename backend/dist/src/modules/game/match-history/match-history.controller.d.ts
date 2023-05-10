import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { MatchHistoryService } from './match-history.service';
export declare class MatchHistoryController {
    private matchHistoryService;
    constructor(matchHistoryService: MatchHistoryService);
    giveTest(): string;
    completeMatchHistory(intraId: number): Promise<MatchHistoryEntry[]>;
}
