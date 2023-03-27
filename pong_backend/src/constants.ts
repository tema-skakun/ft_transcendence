const WIDTH: number = 800;
const HEIGHT: number = 400;
const DOT_WIDTH: number = 50;
const DOT_HEIGHT: number = 50;

export interface Velocity {
	x: number;
	y: number;
}

export let initalVelocity: Velocity = {x: -3, y:0};

export default {
	WIDTH: WIDTH,
	HEIGHT: HEIGHT,
	DOT_WIDTH: DOT_WIDTH,
	DOT_HEIGHT: DOT_HEIGHT,
	DOT_COLOR: "red",
	PADDLE_HEIGHT: 200,
	PADDLE_WIDTH: 50,
	PADDLE_COLOR: "blue",
	PADDING: 50,
	initialState: {
	  dotCoordinate: {
		x: WIDTH / 2 - (DOT_WIDTH / 2),
		y: HEIGHT / 2 - (DOT_HEIGHT / 2),
	  },
	  paddleY: HEIGHT / 4,
	  paddleY2: HEIGHT / 4,

	  velocity: initalVelocity,
	},
  };