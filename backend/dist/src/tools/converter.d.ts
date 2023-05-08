import { GameState } from "../interfaces/GameState";
import { DebugService } from "../debug/debug.service";
export interface Column {
    player1?: string;
    player2?: string;
    gameState?: GameState;
}
export declare const alreadyDeleted: string[];
export declare let notFullyInitalized: string[];
export declare class RelationalTable {
    private debug;
    rows: Map<string, Column>;
    constructor(debug: DebugService);
    getRelation(gid: string): Column;
    addRelation(gid: string, column: Column): void;
    removeRelation(gid: string): boolean;
    mergeColumns(a: Column, b: Column): Column;
}
