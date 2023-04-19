import { useEffect } from 'react';
import { Config } from '../interfaces/config';


export function useCanvas(SCALAR: number, CanvasRef: React.RefObject<HTMLCanvasElement>, CONFIG: Config | null, setDrawingContext: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null>>) {
	useEffect(() => {
		if (!CanvasRef.current || !CONFIG)
			return ;

		console.log(`WIDTH: ${CONFIG.HEIGHT / SCALAR}`);
		console.log(`SCREEN WIDTH: ${window.innerHeight}`);
		CanvasRef.current.width = CONFIG.WIDTH / SCALAR;
		CanvasRef.current.height = CONFIG.HEIGHT / SCALAR;

		const maybeContext: CanvasRenderingContext2D | null  = CanvasRef.current.getContext('2d');
		if (!maybeContext)
			return;

		setDrawingContext(maybeContext);
	}, [CONFIG, CanvasRef, setDrawingContext, SCALAR])
}
