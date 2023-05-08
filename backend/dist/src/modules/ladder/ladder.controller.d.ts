import { UserService } from '../user/user.service';
import { LadderService } from './ladder.service';
export declare class LadderController {
    private ladderService;
    private usrService;
    constructor(ladderService: LadderService, usrService: UserService);
    percentile(intraId: number): Promise<string | number>;
    winsToLossesAll(): Promise<number[]>;
    winsToLosses(intraId: number): Promise<number | string>;
}
