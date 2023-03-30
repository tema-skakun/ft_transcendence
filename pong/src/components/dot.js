import { useContext } from "react";
import { gameContext } from "../App";
import { CONFIG } from "../App";


export function Dot({x, y}) {
	const context = useContext(gameContext);
	if (!context)
		return null;

	if (!y)
		return null;
	context.fillStyle = CONFIG.DOT_COLOR;
	context.fillRect(x, y, CONFIG.DOT_WIDTH, CONFIG.DOT_HEIGHT);
	return null;
}
