import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { Repository } from 'typeorm';
import { matchHistoryInterface } from 'src/entities/matchHistoryEntry/matchHistory.interface';
export declare class MatchHistoryService {
    private rep;
    constructor(rep: Repository<MatchHistoryEntry>);
    create(mh: matchHistoryInterface): Promise<MatchHistoryEntry>;
    save(mh: MatchHistoryEntry): Promise<MatchHistoryEntry>;
    get(intraId: number): Promise<MatchHistoryEntry[]>;
}
