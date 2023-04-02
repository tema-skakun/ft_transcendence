import { ConsoleLogger, Injectable } from "@nestjs/common";
import { row } from "mathjs";
import { GameState } from "../gameService";

export interface Column {
	player1?: string;
	player2?: string;
	gameState?: GameState;
}

@Injectable()
export class RelationalTable {
	public rows: Map<string, Column> = undefined;

	constructor () 
	{
		this.rows = new Map<string, Column>();
	}

	getRelation(gid: string): Column
	{
		return this.rows.get(gid);
	}

	addRelation(gid: string, column: Column) {
		if (!this.rows.has(gid))
		{
			this.rows.set(gid, {...column});
		}
		else {
			// console.log(`Adding to ${gid}:`)
			// console.log(`${JSON.stringify(this.mergeColumns(this.rows.get(gid), column))}`);
			this.rows.set(gid, this.mergeColumns(this.rows.get(gid), column));
		}
	}

	removeRelation(gid: string): boolean {
		return this.rows.delete(gid);
	}

	mergeColumns(a: Column, b: Column): Column {
		return ({
			player1: a.player1 === undefined ? b.player1 : a.player1,
			player2: a.player2 === undefined ? b.player2 : a.player2,
			gameState: a.gameState === undefined ? b.gameState : a.gameState
		})
	}
}
