export type NumberProps = {
	drawingContext: CanvasRenderingContext2D | null;

	num: number;
	x: number;
	y: number;

	font?: string;
	color?: string;
};

export const Numbers = ({
	drawingContext,
	num,
	x,
	y,
	font = '20px Arial',
	color = 'black'
}: NumberProps) => {
	if (!drawingContext)
		return ;
	drawingContext.fillStyle = color;
	drawingContext.font = font;

	drawingContext.fillText(num.toString(), x, y);
}
