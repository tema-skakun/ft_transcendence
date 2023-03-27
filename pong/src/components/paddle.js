import { useContext } from "react";
import { gameContext } from "../App";
import { CONFIG } from "../App";

export function Paddle({x, y}) {
	const context = useContext(gameContext);
	if (!context)
		return null;

	context.fillStyle = CONFIG.PADDLE_COLOR;
	context.fillRect(x, y, CONFIG.PADDLE_WIDTH, CONFIG.PADDLE_HEIGHT);
	return null;
}
