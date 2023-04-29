import io from 'socket.io-client';
import { Socket } from 'socket.io-client'
import { Config } from './interfaces/config';
import { GameState } from './hooks/useSocket';

import { useRef, useState, useCallback} from 'react';

import { QueueButton } from './components/matchmakeing_button';

import MemeOverlay from './components/memeOverlay';

import { Radio } from './components/radio';
import { Canvas } from './components/Canvas';
import { useSocketEmission } from './hooks/useSocketEmission';
import { useSocketRecieve } from './hooks/useSocketRecieve';
import { socket } from '../../../App';

export enum archivements {
	chad,
	triggered
}

export enum winningStates {
	won,
	lost,
	undecided
}


function Game() {
	// <Means for displaying>
	const backgroundImg: React.MutableRefObject<HTMLImageElement> = useRef((() => {
		const img = new Image();
		img.src = '/xmas.jpeg';
		return img;
	})());
	const gameStateRef: React.MutableRefObject<GameState | null> = useRef(null)
	
	const goalsPlayerOne: React.MutableRefObject<number> = useRef(0)
	const goalsPlayerTwo: React.MutableRefObject<number> = useRef(0)

	const [showMe, setShowMe] = useState<boolean>(false);
	const memeUrl = useRef<string>('/pug-dance.gif');
	// </Means for displaying>
	
	// <Stateful>
	const [displayBtn, setDisplayBtn] = useState<boolean>(true);
	const [CONFIG, setCONFIG] = useState<Config | null>(null);
	// </Stateful>
	const winningRef: React.MutableRefObject<winningStates> = useRef(winningStates.undecided);


	const displayMeme = useCallback((arch: archivements) => {
		if (arch === archivements.chad)
			memeUrl.current = '/pug-dance.gif';
		else
			memeUrl.current = '/pug-triggered.gif'
		
		setShowMe(true);
		setTimeout(() => {
			setShowMe(false)
		}, 3000);
	}, [])

	const queueBtnHandler = useCallback(() => {
		// const newSocketConn: Socket<any, any> = io('http://localhost:6969/game', {
		// 	withCredentials: true,
		// 	path: '/gameListener'
		// });
		// if (newSocketConn)
		// 	setSocket(newSocketConn);
		if (socket)
			socket.emit('join', JSON.stringify({}));

		setDisplayBtn(false);
		return (() => {
			// if (!newSocketConn.disconnected)
			// {
			// 	newSocketConn.disconnect();
			// }
		})

	}, []);

	useSocketRecieve(socket,
		displayMeme,
		winningRef,
		goalsPlayerOne,
		goalsPlayerTwo,
		gameStateRef,
		setDisplayBtn,
		setCONFIG);

	useSocketEmission(socket);
	
	if (displayBtn) {
		return		<form>
						<Radio backgroundImg={backgroundImg} />
						<div>
							<QueueButton handler={queueBtnHandler}/>
						</div>
					</form>
	}
	else {
		return (<div className='canvas-container'>
					<div className='canvas-wrapper'>
						<Canvas gameStateRef={gameStateRef} CONFIG={CONFIG} goalsPlayerOne={goalsPlayerOne} goalsPlayerTwo={goalsPlayerTwo} winningRef={winningRef} backgroundImg={backgroundImg} />
						<MemeOverlay showMeme={showMe} memeUrl={memeUrl.current}/>
					</div>
				</div>)
	}
}

export default Game;
