import React from 'react';
import io from 'socket.io-client';
import {useSocket} from './hooks/useSocket';
import { useAnimation} from './hooks/useAnimation'
import { Socket } from 'socket.io-client'
import { Config } from './interfaces/config';
import { GameState } from './hooks/useSocket';

import { useRef, useState, useCallback } from 'react';

import { clear } from './components/initalize';
import { dot } from './components/dot';
import { useCanvas } from './hooks/useCanvas';
import { paddle } from './components/paddle';
import { useKeydown } from './hooks/useKeyhook';

console.log('Executes');
const socket: Socket<any, any> = io('http://localhost:5000');

function handleKeyDown(this: Document, ev: KeyboardEvent) {
	socket.emit('keyDown', ev.code);
}


function App() {
	const gameStateRef: React.MutableRefObject<GameState | null> = useRef(null);
	const CanvasRef: React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

	const [drawingContext, setDrawingContext] = useState<CanvasRenderingContext2D | null>(null)
	const [CONFIG, setCONFIG] = useState<Config | null>(null);

		useSocket(socket, 'handshake', useCallback((CONFIG_STR: string) => {
			setCONFIG(JSON.parse(CONFIG_STR))
		}, [setCONFIG]))

		useSocket(socket, 'playerLeft', useCallback(() => {
			console.log('A PLAYER JUST LEFT!');
		}, []))

	useKeydown(handleKeyDown)

	useSocket(socket, 'gameState', useCallback((GAMESTATE_STR) => {
		gameStateRef.current = JSON.parse(GAMESTATE_STR);
	}, []))

	useCanvas(CanvasRef, CONFIG, setDrawingContext);

	function LoopCallback() {
		if (!drawingContext || !CONFIG || !gameStateRef.current)
			return ;

		clear(CONFIG, drawingContext);
		dot(CONFIG, drawingContext, gameStateRef.current);
		paddle(CONFIG, drawingContext, gameStateRef.current, 1);
		paddle(CONFIG, drawingContext, gameStateRef.current, 2);

		requestAnimationFrame(LoopCallback);
	}

	useAnimation(LoopCallback, drawingContext, CONFIG);

  return (
	<canvas ref={CanvasRef}>
	</canvas>
  );
}

export default App;
