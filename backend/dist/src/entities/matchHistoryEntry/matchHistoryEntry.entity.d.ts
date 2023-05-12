import { User } from "../user/user.entity";
export declare class MatchHistoryEntry {
    id: number;
    played_at: Date;
    looser: User;
    looserGoals: number;
    winner: User;
    winnerGoals: number;
}
