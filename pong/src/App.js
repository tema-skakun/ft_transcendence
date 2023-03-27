import './App.css';

import { Dot } from './components/dot';
import {Paddle} from './components/paddle';
import { GameScreen } from './components/gameScreen';

import { useSocket } from './hooks/socket';
import { useDocument } from './hooks/document';

import { createContext, useState } from 'react';
import { io } from 'socket.io-client';

export let CONFIG = {};

const socket = io('http://localhost:5000');
export const gameContext = createContext();

function App() {
	const [isLoading, setIsLoading] = useState(true);
	
	const [gameState, setGameState] = useState();
	const [context, setContext] = useState(null);
	
	useSocket(socket, 'handshake', (CONFIG_STR) => {
		CONFIG = JSON.parse(CONFIG_STR);
		setGameState(CONFIG.initialState);
	})

	useSocket(socket, 'start', () => {
		setIsLoading(false);
	})
	
	useSocket(socket, 'gameState', (_gameState) => {
		setGameState(_gameState);
		if (!context)
			return;
		context.clearRect(0, 0,CONFIG.WIDTH, CONFIG.HEIGHT); // Causing the flickering
	})

	useDocument('keydown', (_event) => {
		socket.emit('keydown', _event.keyCode)
	})

  return (
	isLoading ? <div>is Loading...</div> :
    <div id="App">
		<gameContext.Provider value={context}>
			<GameScreen setContext={setContext} >
				<Dot x={gameState.dotCoordinate.x} y={gameState.dotCoordinate.y} />
				<Paddle x={CONFIG.PADDING} y={gameState.paddleY}/>
				<Paddle x={CONFIG.WIDTH - CONFIG.PADDLE_WIDTH - CONFIG.PADDING} y={gameState.paddleY2}/>
			</GameScreen>
		</gameContext.Provider>
    </div>
  );
}

export default App;
