import { Injectable } from "@nestjs/common";
import CONFIG from './constants';
import { Velocity } from "./constants";
import * as math from 'mathjs';
import { ArgumentOutOfRangeError } from "rxjs";

import { RelationalTable } from './converter';
import { exit } from "process";

export interface GameState {
	dotCoordinate : {
		x: number;
		y: number;
	};
	paddleY: number;
	paddleY2: number;

	id?: string;
	velocity?: Velocity;
}

@Injectable()
export class GameService {

	constructor(private relations: RelationalTable) {}

	createGame(gid: string) {
		this.relations.addRelation(gid, {gameState: CONFIG.initialState})
	}
	
	update(gid: string): void {
			const gState: GameState = this.relations.getRelation(gid).gameState;
			if (!gState)
			{
				console.log(`No Game State associated with gid: ${gid}`);
				throw Error;
			}

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
			let hitPoint: number = 0;
			if ((hitPoint = this.hit(Dot_box, Paddle_box)) !== undefined
				|| (hitPoint = this.hit(Dot_box, Paddle_box2)) !== undefined)
			{
				this.deflection(hitPoint, gid);
			}

			gState.dotCoordinate.x += gState.velocity.x;
			gState.dotCoordinate.y += gState.velocity.y;
	}

	getDeflectionMatrix(hitPoint: number) {
		// Define the min and max angles of deflection in radians
		const minAngle = -Math.PI / 4; // -45 degrees
		const maxAngle = Math.PI / 4;  // 45 degrees
	  
		// Calculate the actual angle based on the hitPoint value
		const angle = - hitPoint * (maxAngle - minAngle) / 2;
	  
		// Create the deflection matrix using the calculated angle
		const deflectionMatrix = [
		  [- Math.cos(2 * angle), Math.sin(2 * angle)],
		  [Math.sin(2 * angle), Math.cos(2 * angle)]
		];
	  
		return deflectionMatrix;
	}

	deflection(hitPoint: number, gid: string): void {
		const gState: GameState = this.relations.getRelation(gid).gameState;
		if (!gState)
		{
			console.log(`No Game State associated with gid: ${gid}`);
			throw Error;
		}

		let velocityVec: math.Matrix = math.matrix([
			[gState.velocity.x],
			[gState.velocity.y]
		])

		velocityVec = math.multiply(this.getDeflectionMatrix(hitPoint), velocityVec);
		gState.velocity.x = velocityVec.get([0, 0]);
		gState.velocity.y = velocityVec.get([1, 0]);
	}

	hit(box1: math.Matrix, box2: math.Matrix): number {
		const dimensions: number [] = box1.size();
		const dimensions2: number [] = box2.size();

		if (dimensions[1] !== 2 || dimensions2[1] !== 2) // not 'boxes'
			throw ArgumentOutOfRangeError;

		if (dimensions[0] !== dimensions2[0] || dimensions[0] < 2) // 'boxes' of different dimenstions or not 2d boxes
			throw ArgumentOutOfRangeError;
		
		for (let i = 0; i < dimensions[0]; ++i)
		{
			const box1Min = box1.get([i, 0]);
			const box1Max = box1.get([i, 1]);
			const box2Min = box2.get([i, 0]);
			const box2Max = box2.get([i, 1]);

			if (box1Max < box2Min || box2Max < box1Min) {
				return undefined;
			}
		}

		const possibiltySpace = box2.get([1, 1]) - box2.get([1, 0]) + box1.get([1, 1]) - box1.get([1, 0]);
		const normed = ((box1.get([1, 1]) - box2.get([1, 0])) / possibiltySpace) * 2 - 1;
		return normed;
	}

	gameState(gid: string): GameState  {
		const gState: GameState  = this.relations.getRelation(gid).gameState
		return (gState)
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

		if (keycode == "40")
		{
			(playernum === 1) ? gState.paddleY += 5 : gState.paddleY2 += 5;
		}
		else if (keycode == "38")
		{
			(playernum === 1) ? gState.paddleY -= 5 : gState.paddleY2 -= 5;
		}
	}

}
