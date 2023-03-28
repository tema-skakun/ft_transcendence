import { Injectable } from "@nestjs/common";
import { row } from "mathjs";
import { GameState } from "./gameService";

interface Column {
	player1?: string;
	player2?: string;
	gameState?: GameState;
}

@Injectable()
export class RelationalTable {
	private rows: Map<string, Column> = undefined;

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
			this.rows.set(gid, {...column});
		else {
			this.rows.set(gid, this.mergeColumns(this.rows.get(gid), column));
		}
	}

	mergeColumns(a: Column, b: Column): Column {
		return ({
			player1: a.player1 === undefined ? b.player1 : a.player1,
			player2: a.player2 === undefined ? b.player2 : a.player2,
			gameState: a.gameState === undefined ? b.gameState : a.gameState
		})
	}
}
