import { UserTransformed } from '../user/user.transformed';
export declare class MatchHistoryTransformed {
    id: number;
    played_at: Date;
    looser: UserTransformed;
    winner: UserTransformed;
    looserGoals: number;
    winnerGoals: number;
}
