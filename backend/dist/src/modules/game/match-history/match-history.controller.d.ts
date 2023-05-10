import { MatchHistoryService } from './match-history.service';
import { MatchHistoryTransformed } from 'src/entities/matchHistoryEntry/matchHistoryEntry.transformed';
export declare class MatchHistoryController {
    private matchHistoryService;
    constructor(matchHistoryService: MatchHistoryService);
    completeMatchHistory(intraId: number): Promise<MatchHistoryTransformed[]>;
}
