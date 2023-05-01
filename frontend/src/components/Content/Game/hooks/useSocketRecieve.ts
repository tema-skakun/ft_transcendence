import React, { useCallback } from "react";
import { Socket } from "socket.io-client";
import { archivements, winningStates } from "../Game";
import { GameState } from "./useSocket";
import { useEffect } from "react";
import { SocketAddress } from "net";

function attach(socket: Socket<any, any>, event: string, cb: Function) {
	if (!socket.hasListeners(event))
	{
		socket.on(event, cb);
	}
}

export function useSocketRecieve(socket: Socket<any, any> | null,
	displayMeme: (a: archivements) => void,
	winningRef: React.MutableRefObject<winningStates>,
	goalsPlayerOne: React.MutableRefObject<number>,
	goalsPlayerTwo: React.MutableRefObject<number>,
	gameStateRef: React.MutableRefObject<GameState | null>,
	setDisplayBtn: Function,
	setCONFIG: Function,
	toggleDisplayPopUp: () => void,
	setInvitedBy: Function) {

	const manageSocketConnection = useCallback(() => {
		if (!socket)
			return ;

		attach(socket, 'tripple streak', () => {
			displayMeme(archivements.chad);
		})

		attach(socket, 'inviteReq', (inviter: string, callback: (res: string) => void) => {
			setInvitedBy([inviter, callback]);
			toggleDisplayPopUp();
		})

		socket.on('tripple loose', () => {
			displayMeme(archivements.triggered);
		})

		socket.on('winner', () => {
			winningRef.current = winningStates.won;
			goalsPlayerOne.current = 0;
			goalsPlayerTwo.current = 0;;
			setTimeout(() => {
				gameStateRef.current = null;
				setDisplayBtn(true);
				winningRef.current = winningStates.undecided;
			}, 3000);
		})

		socket.on('looser', () => {
			winningRef.current = winningStates.lost;
			goalsPlayerOne.current = 0;
			goalsPlayerTwo.current = 0;
			setTimeout(() => {
				gameStateRef.current = null;
				setDisplayBtn(true);
				winningRef.current = winningStates.undecided;
			}, 3000);
		})

		// <Coupled handlers>
		socket.on('disconnect', () => {
			console.log('DISSSSCONNECT RECIEVED');
			setTimeout(() => {
				gameStateRef.current = null;
				setDisplayBtn(true);
				winningRef.current = winningStates.undecided;
			}, 3000);
		})
		
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
	}, [socket, displayMeme,
	winningRef,
	setDisplayBtn,
	goalsPlayerOne,
	goalsPlayerTwo,
	setCONFIG,
	gameStateRef])

	useEffect(manageSocketConnection, [manageSocketConnection]);
}
