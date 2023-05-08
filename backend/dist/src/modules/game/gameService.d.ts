import { RelationalTable } from '../../tools/converter';
import { Client } from "src/classes/client";
import { UserRestriction } from "src/classes/UserRestriction";
export declare class GameService {
    private relations;
    private userRestriction;
    constructor(relations: RelationalTable, userRestriction: UserRestriction);
    createGame(player2: Client): void;
    physics(player2: Client): void;
    goals(player2: Client): string;
    keyChange(code: string, player: Client, activate: boolean): void;
}
