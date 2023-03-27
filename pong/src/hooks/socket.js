import { useEffect } from "react";

export const useSocket = (socket, _event, callback) => {
	useEffect(() => {
		socket.on(_event, callback);
		return ( () => {
			socket.off(_event, callback);
		})
	}, [socket, _event, callback]);
}
