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
import { walkUpBindingElementsAndPatterns } from 'typescript';

enum winningStates {
	won,
	lost,
	undecided
}


function Game({state}: {state: any}) {
	void state;

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
	const winningRef: React.MutableRefObject<winningStates> = useRef(winningStates.undecided);
	
	// <Responsive>
	const handleResize = useCallback(() => {
		if (!CONFIG)
			return ;

		if ((window.innerHeight / window.innerWidth) < (2/3))
		{
			console.log('IF' + (CONFIG.HEIGHT / window.innerHeight));
			setSCALAR(CONFIG.HEIGHT / window.innerHeight);
		}
		else
		{
			console.log('ELSE');
			setSCALAR(CONFIG.WIDTH / window.innerWidth);
		}
		// setSCALAR(1); // Took out scaleing for css.
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
		winningRef.current = winningStates.undecided;
		const newSocketConn: Socket<any, any> = io('http://localhost:6969/game', {
			withCredentials: true,
			path: '/gameListener'
		});
		if (newSocketConn)
			setSocket(newSocketConn);

		setDisplayBtn(false);
		return (() => {
			if (!newSocketConn.disconnected)
			{
				newSocketConn.disconnect();
			}
		})

	}, []);

	
	const manageSocketConnection = useCallback(() => {
		if (!socket)
		return ;

		socket.on('winner', () => {
			winningRef.current = winningStates.won;
			goalsPlayerOne.current = 0;
			goalsPlayerTwo.current = 0;
		})

		socket.on('looser', () => {
			winningRef.current = winningStates.lost;
			goalsPlayerOne.current = 0;
			goalsPlayerTwo.current = 0;
		})

		// <Coupled handlers>
		socket.on('disconnect', () => {
			gameStateRef.current = null;
			setDisplayBtn(true);
			console.log('You disconneced/got disconnected');
		})

		// socket.on('playerLeft', () => {
		// 	console.log('A PLAYYYR JUST LEFT');
		// 	setDisplayBtn(true);
		// })
		// </Coupled handlers>
		
		socket.on('handshake', (CONFIG_STR: string) => {
			console.log('HANDSHAKE');
			setCONFIG(JSON.parse(CONFIG_STR))
		})
		
		socket.on('gameState', (GAMESTATE_STR: string) => {
			console.log('GAMESTATE');
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
				num: goalsPlayerOne.current.toString(),
				x: (CONFIG.WIDTH / 4) / SCALAR,
				y: (CONFIG.PADDING + 20) / SCALAR,
				font: `${40 / SCALAR}px Arial`
			})
			Numbers({
				drawingContext: drawingContext,
				num: goalsPlayerTwo.current.toString(),
				x: ((CONFIG.WIDTH / 4) * 3) / SCALAR,
				y: (CONFIG.PADDING + 20) / SCALAR,
				font: `${40 / SCALAR}px Arial`
			})
			if (winningRef.current === winningStates.lost)
			{
				Numbers({drawingContext: drawingContext,
				num: 'YOU LOST',
				x: (CONFIG.WIDTH / 2) / SCALAR,
				y: (CONFIG.HEIGHT / 2) / SCALAR,
				font: `${80 / SCALAR} 'Press Start 2P', cursive`})
				setTimeout(() => clear(SCALAR, CONFIG, drawingContext), 4000);
			}
			else if (winningRef.current === winningStates.won)
			{
				Numbers({drawingContext: drawingContext,
					num: 'YOU WON',
					x: (CONFIG.WIDTH / 2) / SCALAR,
					y: (CONFIG.HEIGHT / 2) / SCALAR,
					font: `${80 / SCALAR} 'Press Start 2P', cursive`})
				
				setTimeout(() => clear(SCALAR, CONFIG, drawingContext), 4000);
			}
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



export default Game;
