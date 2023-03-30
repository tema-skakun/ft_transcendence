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
	[-3],
	[0]
])


export default {
	SPAWN_EXCLUSION: HEIGHT / 4,
	UPDATE_INTERVAL: 10,
	DEGREES: 45,
	WIDTH: WIDTH,
	HEIGHT: HEIGHT,
	DOT_WIDTH: DOT_WIDTH,
	DOT_HEIGHT: DOT_HEIGHT,
	DOT_COLOR: "red",
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

	  velocity: initalVelocity,
	},
  };