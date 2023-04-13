import { Injectable } from "@nestjs/common";
import CONFIG, { initalVelocity, randomVelocity } from '../../constants/constants';
import * as math from 'mathjs';
import { deflection, getHitPoint } from "../../tools/linearAlgebra"

import { GameState } from '../../interfaces/GameState'
import { alreadyDeleted, notFullyInitalized, RelationalTable } from '../../tools/converter';
import { random } from "mathjs";
import { getPaddleBox, getPaddleBox2, getDotBox } from "../../tools/physicalObjects";

function noGameStateError(gState: GameState | undefined, gid: string) {
	if (!gState)
	{
			for (const str of  notFullyInitalized) {
				if (str === gid)
					console.log('WAS NOT FULLY INITALIZED');	
			}
			for (const str of  alreadyDeleted) {
				if (str === gid)
					console.log('HAS BEEN ALREADY DELETED');		
			}

			throw Error(`No Game State associated with gid: ${gid}`);
	}
}


const UPPERBOUND: math.Matrix = math.matrix([
	[0, CONFIG.WIDTH],
	[CONFIG.HEIGHT, CONFIG.HEIGHT + 10]
])

const LOWERBOUND: math.Matrix = math.matrix([
	[0, CONFIG.WIDTH],
	[0, -10]
])


@Injectable()
export class GameService {
	private gameActive: boolean = false;

	constructor(private relations: RelationalTable) {}

	createGame(gid: string) {
		this.relations.addRelation(gid, {gameState: {...CONFIG.initialState, dotCoordinate: {...CONFIG.initialState.dotCoordinate}, velocity: initalVelocity }}) // Tag by reference?
		this.gameActive = true;
	}
	
	physics(gid: string): void {
			if (!this.gameActive)
				return ;

			const gState: GameState = this.relations.getRelation(gid)?.gameState;
			noGameStateError(gState, gid);

			if (!gState.dotCoordinate.y)
			{
				gState.dotCoordinate.y = random(CONFIG.SPAWN_EXCLUSION , CONFIG.HEIGHT - CONFIG.SPAWN_EXCLUSION);
			}

			// <Object boundaries>
				const Dot_box: math.Matrix = getDotBox(gState);
				const Paddle_box: math.Matrix = getPaddleBox(gState);
				const Paddle_box2: math.Matrix = getPaddleBox2(gState);
			// </Physical objects>

			let hitPoint: number = 0;
			if (getHitPoint(Dot_box, UPPERBOUND) || getHitPoint(Dot_box, LOWERBOUND))
				gState.velocity = deflection({velocity: gState.velocity})
			if ((hitPoint = getHitPoint(Dot_box, Paddle_box)) !== undefined)
				gState.velocity = deflection({velocity: gState.velocity, paddle: {hitPoint: hitPoint, paddleNr: 1}})
			if ((hitPoint = getHitPoint(Dot_box, Paddle_box2)) !== undefined)
				gState.velocity = deflection({velocity: gState.velocity, paddle: {hitPoint: hitPoint, paddleNr: 2}})

			gState.dotCoordinate.x += gState.velocity.get([0, 0]);
			gState.dotCoordinate.y += gState.velocity.get([1, 0]);
	}

	gameActions(gid: string): string {
		const gState: GameState = this.relations.getRelation(gid)?.gameState;
		noGameStateError(gState, gid);

		if (gState.dotCoordinate.x < 0)
		{
				gState.dotCoordinate.x = CONFIG.initialState.dotCoordinate.x;
				gState.dotCoordinate.y = random(CONFIG.SPAWN_EXCLUSION , CONFIG.HEIGHT - CONFIG.SPAWN_EXCLUSION);
			gState.velocity = randomVelocity();
			return ('goal player2');
		}
		else if (gState.dotCoordinate.x > CONFIG.WIDTH)
		{			gState.dotCoordinate.x = CONFIG.initialState.dotCoordinate.x;
					gState.dotCoordinate.y = random(CONFIG.SPAWN_EXCLUSION , CONFIG.HEIGHT - CONFIG.SPAWN_EXCLUSION);
			gState.velocity = randomVelocity();
			return ('goal player1');
		}
	
		return ('none');
	}

	keyDown(code: string, playerId: string, gid: string): void {
		if (!this.gameActive)
			return;

		if (!this.relations.getRelation(gid)) // Never trust that frontend disabled hook!... This is where you need a guard
			return;

		const gState: GameState = this.relations.getRelation(gid).gameState;
		noGameStateError(gState, gid);

		let playernum: number
		{
			(this.relations.getRelation(gid).player1 === playerId) ? (playernum = 1) : (playernum = 2);
		}

		if (code == 'ArrowDown')
		{
			if (playernum === 1)
			{
				gState.paddleY += 5
			}
			else
			{
				gState.paddleY2 += 5;
			}
		}
		else if (code == 'ArrowUp')
		{
			(playernum === 1) ? gState.paddleY -= 5 : gState.paddleY2 -= 5;
		}
	}

}
