import { Injectable } from "@nestjs/common";
import CONFIG, { initalVelocity } from './constants';
import { Velocity } from "./constants";
import * as math from 'mathjs';
import { ArgumentOutOfRangeError } from "rxjs";
import { deflection, getHitPoint } from "./tools/linearAlgebra"

import { RelationalTable } from './tools/converter';
import { random } from "mathjs";

export interface GameState {
	dotCoordinate : {
		x: number;
		y: number;
	};
	paddleY: number;
	paddleY2: number;

	id?: string;
	velocity?: math.Matrix;
}

const KEY_DOWN: string = "40";
const KEY_UP: string = "38"; 


@Injectable()
export class GameService {

	constructor(private relations: RelationalTable) {}

	createGame(gid: string) {
		this.relations.addRelation(gid, {gameState: {...CONFIG.initialState, dotCoordinate: {...CONFIG.initialState.dotCoordinate}, velocity: initalVelocity }}) // Tag by reference?
	}
	
	update(gid: string): void {
			const gState: GameState = this.relations.getRelation(gid).gameState;
			if (!gState)
			{
				console.log(`No Game State associated with gid: ${gid}`);
				throw Error;
			}
			if (!gState.dotCoordinate.y)
			{
				gState.dotCoordinate.y = random(CONFIG.SPAWN_EXCLUSION , CONFIG.HEIGHT - CONFIG.SPAWN_EXCLUSION);
			}

			// <Object boundaries>
				const Dot_box: math.Matrix = math.matrix( [
					[gState.dotCoordinate.x, gState.dotCoordinate.x + CONFIG.DOT_WIDTH],
					[gState.dotCoordinate.y, gState.dotCoordinate.y + CONFIG.DOT_HEIGHT],
					]
				)
				const Paddle_box: math.Matrix = math.matrix( [
					[CONFIG.PADDING, CONFIG.PADDING + CONFIG.PADDLE_WIDTH],
					[gState.paddleY, gState.paddleY + CONFIG.PADDLE_HEIGHT],
					]
				)
				const Paddle_box2: math.Matrix = math.matrix( [
					[CONFIG.WIDTH - CONFIG.PADDING - CONFIG.PADDLE_WIDTH, CONFIG.WIDTH - CONFIG.PADDING],
					[gState.paddleY2, gState.paddleY2 + CONFIG.PADDLE_HEIGHT],
					]
				)

				const upperBound: math.Matrix = math.matrix([
					[0, CONFIG.WIDTH],
					[CONFIG.HEIGHT, CONFIG.HEIGHT + 10]
				])

				const lowerBound: math.Matrix = math.matrix([
					[0, CONFIG.WIDTH],
					[0, -10]
				])
			// </Object boundaries>

			if (getHitPoint(Dot_box, upperBound) || getHitPoint(Dot_box, lowerBound))
			{
				gState.velocity = deflection({velocity: gState.velocity})
			}

			let hitPoint: number = 0;
			if ((hitPoint = getHitPoint(Dot_box, Paddle_box)) !== undefined)
			{
				const velocity: math.Matrix = gState.velocity;
				gState.velocity = deflection({velocity: gState.velocity, paddle: {hitPoint: hitPoint, paddleNr: 1}}) // Tag velocity passed by reference?
			}
			if ((hitPoint = getHitPoint(Dot_box, Paddle_box2)) !== undefined)
			{
				gState.velocity = deflection({velocity: gState.velocity, paddle: {hitPoint: hitPoint, paddleNr: 2}}) // Tag velocity passed by reference?
			}

			gState.dotCoordinate.x += gState.velocity.get([0, 0]);
			gState.dotCoordinate.y += gState.velocity.get([1, 0]);
	}

	keydown(keycode: string, playerId: string, gid: string): void {
		const gState: GameState = this.relations.getRelation(gid).gameState;
		if (!gState)
		{
			console.log(`No Game State associated with gid: ${gid}`);
			throw Error;
		}

		let playernum: number
		{
			(this.relations.getRelation(gid).player1 === playerId) ? (playernum = 1) : (playernum = 2);
		}

		if (keycode == KEY_DOWN)
		{
			(playernum === 1) ? gState.paddleY += 5 : gState.paddleY2 += 5;
		}
		else if (keycode == KEY_UP)
		{
			(playernum === 1) ? gState.paddleY -= 5 : gState.paddleY2 -= 5;
		}
	}

}
