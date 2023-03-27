import { Injectable } from "@nestjs/common";
import { GameState } from "./gameService";

interface GameData {
	gid?: string,
	gameState?: GameState,
	player1?: string,
	player2?: string
}

export function isGameState(value: GameState | string): value is GameState {
	return (value as GameState).dotCoordinate !== undefined
}

export function isString(value: GameState | string): value is string {
	return (value as string).charCodeAt !== undefined
}

@Injectable()
export class Converter {
	private maps: Map<string | GameState, string | GameState>[][];

	public static GID: number = 0;
	public static GSTATE: number = 1;
	public static PLID1: number = 2;
	public static PLID2: number = 3;
  
	constructor() {
	  // Initialize the 2D array of Maps
	  this.maps = [
		[undefined, new Map(), new Map(), new Map()],
		[new Map(), undefined, new Map(), new Map()],
		[new Map(), new Map(), undefined, new Map()],
		[new Map(), new Map(), new Map(), undefined],
	  ];
	}
  
	add(gameData: GameData): void {
	  const tempAssociated = [gameData.gid, gameData.gameState, gameData.player1, gameData.player2];
  
	  // Update the maps with the new entry
	  for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (i === j) continue;
			if (!tempAssociated[i]) continue;
			if (this.maps[i][j].has(tempAssociated[i]) && tempAssociated[j] === undefined) continue;

			this.maps[i][j].set(tempAssociated[i], tempAssociated[j]);
		}
	  }
	}
  
	getMap(key: [number, number]): Map<string | GameState, string | GameState> {
	  if (key[0] === key[1])
		throw RangeError;

	  return this.maps[key[0]][key[1]];
	}
}
