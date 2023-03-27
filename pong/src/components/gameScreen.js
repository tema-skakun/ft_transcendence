import { useEffect } from "react";
import { useRef } from "react";
import { CONFIG } from "../App";

export function GameScreen({children, setContext}) {
	const canvas = useRef();

	useEffect (() => {
		const ctx = canvas.current.getContext('2d');
		if (!ctx)
			return ;

		setContext(ctx);
	}, [canvas, setContext])

	return (
			<canvas ref={canvas} id="gameScreen" width={CONFIG.WIDTH} height={CONFIG.HEIGHT}>
				{children}
			</canvas>
	)
}