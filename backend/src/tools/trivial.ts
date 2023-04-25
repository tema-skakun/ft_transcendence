import { Socket } from "socket.io";
import CONFIG from '../constants/constants';
import { random } from "mathjs";
import { Client } from "src/classes/client";



export function spawnY(): number {
	return random(CONFIG.SPAWN_EXCLUSION , CONFIG.HEIGHT - CONFIG.SPAWN_EXCLUSION);
}

export function socketToCookie(socket: Socket) : string
{
	if (!socket.handshake.headers.cookie)
	throw Error('no cookie was set');
	return (socket.handshake.headers.cookie)
}

export async function roomToSocket(namespace: any, room: string): Promise<Set<string>>
{
	return await namespace.adapter.sockets(new Set<string>([room]));
}

export async function setOtherPlayer(client: Client) {
	const socketIdsInRoom: Set<string> = await roomToSocket(client.nsp, client.pendingMatchRequest);
	
	socketIdsInRoom.delete(client.id);
	socketIdsInRoom.forEach((socketId: string) => {
		client.otherPlayerObj = this.clients.get(socketId);
	})
}