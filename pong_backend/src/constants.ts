import * as math from "mathjs";

const WIDTH: number = 1000;
const HEIGHT: number = 400;
const DOT_WIDTH: number = 50;
const DOT_HEIGHT: number = 50;

export interface Velocity {
	x: number;
	y: number;
}

export let initalVelocity: math.Matrix = math.matrix([
	[(math.random(0, 1) < 0.5 ? -3 : 3)],
	[0]
])

export const randomVelocity: () => math.Matrix = () => math.matrix([
	[(math.random(0, 1) < 0.5) ? -3 : 3],
	[0]
]);

export interface ConfigInter {
	BACKGROUND_COLOR: string;
	SPAWN_EXCLUSION: number;
	UPDATE_INTERVAL: number;
	DEGREES: number;
	WIDTH: number;
	HEIGHT: number;
	DOT_WIDTH: number;
	DOT_HEIGHT: number;
	DOT_COLOR: string;
	PADDLE_HEIGHT: number;
	PADDLE_WIDTH: number;
	PADDLE_COLOR: string;
	PADDING: number;
	initialState: {
	dotCoordinate: {
		x: number;
		y: number;
	};
	paddleY: number;
	paddleY2: number;
	}

}

export default {
	BACKGROUND_COLOR: 'red',
	SPAWN_EXCLUSION: HEIGHT / 4,
	UPDATE_INTERVAL: 10,
	DEGREES: 45,
	WIDTH: WIDTH,
	HEIGHT: HEIGHT,
	DOT_WIDTH: DOT_WIDTH,
	DOT_HEIGHT: DOT_HEIGHT,
	DOT_COLOR: "white",
	PADDLE_HEIGHT: 200,
	PADDLE_WIDTH: 50,
	PADDLE_COLOR: "violet",
	PADDING: 50,
	initialState: {
	  dotCoordinate: {
		x: WIDTH / 2 - (DOT_WIDTH / 2),
		y: undefined, // moking value: HEIGHT / 2 - (DOT_HEIGHT / 2)
	  },
	  paddleY: HEIGHT / 4,
	  paddleY2: HEIGHT / 4,
	},
  };