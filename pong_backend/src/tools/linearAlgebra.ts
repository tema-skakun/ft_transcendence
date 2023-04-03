import { Velocity } from "src/constants";
import CONFIG from "src/constants";
import { GameState } from "src/gameService";
import * as math from "mathjs";
import { ArgumentOutOfRangeError } from "rxjs";

const deflectionMatrixBorder: math.Matrix = math.matrix([
	[1, 0],
	[0, -1]
])

const identityMatrix: math.Matrix = math.matrix([
	[1, 0],
	[0, 1]
])

function getDeflectionMatrix(hitPoint: number, velocity: math.Matrix): math.Matrix {
	// Define the min and max angles of deflection in radians
	const minAngle = -(Math.PI / 180) * CONFIG.DEGREES; // -45 degrees
	const maxAngle = (Math.PI / 180) * CONFIG.DEGREES;  // 45 degrees
  
	// Calculate the actual angle based on the hitPoint value
	let angle = hitPoint * (maxAngle - minAngle) / 2;
	if (velocity.get([0, 0]) < 0) // TAG
		angle = -angle;
  
	// Create the deflection matrix using the calculated angle
	let deflectionMatrix: math.Matrix = math.matrix([
	  [- Math.cos(2 * angle), Math.sin(2 * angle)],
	  [Math.sin(2 * angle), Math.cos(2 * angle)]
	]);
  
	return deflectionMatrix;
}

interface DeflectionParameters {
	velocity: math.Matrix;
	paddle?: {hitPoint: number, paddleNr: number};
}

export function deflection({velocity, paddle}: DeflectionParameters): math.Matrix {

	let newVelocity: math.Matrix = undefined;

	if (paddle)
	{
		const deflectionMatrix: math.Matrix = getDeflectionMatrix(paddle.hitPoint, velocity);
		newVelocity = math.multiply(deflectionMatrix, velocity); 
		 
		
		if (paddle.paddleNr == 1 && velocity.get([0, 0]) > 0)
			return (math.multiply(identityMatrix, velocity));
		if (paddle.paddleNr == 2 && velocity.get([0, 0]) < 0)
			return (math.multiply(identityMatrix, velocity));
	}
	else
	{
		newVelocity = math.multiply(deflectionMatrixBorder, velocity);
	}

	if (!newVelocity)
		throw Error;

	return (newVelocity);
}

export function getHitPoint(box1: math.Matrix, box2: math.Matrix): number {
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
