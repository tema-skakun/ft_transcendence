// import { useState } from 'react';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

export function useSocketLifecycle(socket: Socket<any, any>): void {
	useEffect(() => {

		return (() => {
			socket.disconnect();
		})
	}, [socket])
}