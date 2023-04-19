import io from 'socket.io-client';
import { useAnimation} from './hooks/useAnimation'
import { Socket } from 'socket.io-client'
import { Config } from './interfaces/config';
import { GameState } from './hooks/useSocket';

import { useRef, useState, useCallback, useEffect } from 'react';

import { Numbers } from './components/number';
import { QueueButton } from './components/matchmakeing_button';

import { clear } from './components/initalize';
import { dot } from './components/dot';
import { useCanvas } from './hooks/useCanvas';
import { paddle } from './components/paddle';
import { useKeydown } from './hooks/useKeyhook';
import { useKeyup } from './hooks/useKeyup';


function App() {
	// <Means for displaying>
	const [SCALAR, setSCALAR] = useState<number>(1); // For scaleing... responsive web design
	const gameStateRef: React.MutableRefObject<GameState | null> = useRef(null);
	const CanvasRef: React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
	const [drawingContext, setDrawingContext] = useState<CanvasRenderingContext2D | null>(null)
	
	const goalsPlayerOne: React.MutableRefObject<number> = useRef(0) // TAG what does mutable mean here
	const goalsPlayerTwo: React.MutableRefObject<number> = useRef(0) // TAG what does mutable mean here
	// </Means for displaying>
	
	// <Stateful>
	const [socket, setSocket] = useState<Socket<any, any> | null>(null);
	const [displayBtn, setDisplayBtn] = useState<boolean>(true);
	const [CONFIG, setCONFIG] = useState<Config | null>(null);
	// </Stateful>

	// <Responsive>
	const handleResize = useCallback(() => {
		if (!CONFIG)
			return ;

		// if ((window.innerHeight / window.innerWidth) < (2/3))
		// {
		// 	console.log('IF' + (CONFIG.HEIGHT / window.innerHeight));
		// 	setSCALAR(CONFIG.HEIGHT / window.innerHeight);
		// }
		// else
		// {
		// 	console.log('ELSE');
		// 	setSCALAR(CONFIG.WIDTH / window.innerWidth);
		// }
		setSCALAR(1); // Took out scaleing for css.
	}, [CONFIG])

	useEffect(() => { // As soon as we get the config we calculate the scalar.
		if (!CONFIG)
			return ;

		handleResize(); // call once even without resize.

		window.addEventListener('resize', handleResize)
		return (() => {
			window.removeEventListener('resize', handleResize);
		})
	}, [CONFIG, handleResize]) // Yields the SCALAR for further displays.

	// <Responsive>

	const queueBtnHandler = useCallback(() => {
		const newSocketConn: Socket<any, any> = io('http://localhost:5000/game');
		if (newSocketConn)
			setSocket(newSocketConn);

		setDisplayBtn(false);
		return (() => {
			newSocketConn.disconnect();
		})

	}, []);

	
	const manageSocketConnection = useCallback(() => {
		if (!socket)
		return ;
		
		socket.on('handshake', (CONFIG_STR: string) => {
			setCONFIG(JSON.parse(CONFIG_STR))
		})
		
		socket.on('gameState', (GAMESTATE_STR: string) => {
			gameStateRef.current = JSON.parse(GAMESTATE_STR);
		})
		
		socket.on('goal', (PLAYER_STR: string) => {
			console.log('A GOOAL HAS HAPPENDED');
			if (PLAYER_STR === 'player1')
			{
				++goalsPlayerOne.current;
			}
			else if (PLAYER_STR === 'player2')
			{
				++goalsPlayerTwo.current;
			}
		})
		
		socket.on('playerLeft', () => {
			console.log('A PLAYER JUST LEFT!');
		})
		
		return (() =>
		{
			socket.offAny();
		}
		)
	}, [socket])
	
	useEffect(manageSocketConnection, [manageSocketConnection]);
	
	
	// <document events>
	
	// <emmiting events>
	const handlekeydown = useCallback((ev: KeyboardEvent) => {
		if (!socket)
		{
			return ;
		}
		socket.emit('keydown', ev.code);
	}, [socket])
	
	const handlekeyup = useCallback((ev: KeyboardEvent) => {
		if (!socket)
		{
			return ;
		}
		socket.emit('keyup', ev.code);
	}, [socket])
	
	// </emmiting events>
	
	useKeydown(handlekeydown);
	useKeyup(handlekeyup)
	
	
	// </document events>
	
	useCanvas(SCALAR, CanvasRef, CONFIG, setDrawingContext);
	
	const draw = useCallback(() => {
		if (!drawingContext || !CONFIG)
		return ;
		
		clear(SCALAR, CONFIG, drawingContext);
		if (gameStateRef.current)
		{
			dot(SCALAR, CONFIG, drawingContext, gameStateRef.current);
			paddle(SCALAR, CONFIG, drawingContext, gameStateRef.current, 1);
			paddle(SCALAR, CONFIG, drawingContext, gameStateRef.current, 2);
			Numbers({
				drawingContext: drawingContext,
				num: goalsPlayerOne.current,
				x: (CONFIG.WIDTH / 4) / SCALAR,
				y: (CONFIG.PADDING + 20) / SCALAR,
			})
			Numbers({
				drawingContext: drawingContext,
				num: goalsPlayerTwo.current,
				x: ((CONFIG.WIDTH / 4) * 3) / SCALAR,
				y: (CONFIG.PADDING + 20) / SCALAR,
			})
		}
	}, [drawingContext, CONFIG, SCALAR])
	
	// <Means for animation>
	const LoopCallback = useCallback(() => {
		draw();
		requestAnimationFrame(LoopCallback);
	}, [draw])
	
	useAnimation(LoopCallback, drawingContext, CONFIG);
	// </Means for animation>
	
	if (displayBtn) {
		return <div><QueueButton handler={queueBtnHandler}/></div>
	}
	else {
		return (<div className='canvas-container'>
					<div className='canvas-wrapper'>
						<canvas ref={CanvasRef} id='gameScreen'></canvas>
					</div>
				</div>)
	}
}



export default App;
