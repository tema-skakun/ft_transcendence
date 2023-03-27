import { WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, SubscribeMessage, MessageBody} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { GameService } from './gameService';
import { GameState } from './gameService';
import CONFIG from './constants';

import { Converter } from './converter';
import { boolean } from 'mathjs';

class Client extends Socket {
	public playernum: number;
	constructor(socket: Socket) {
		super(socket.nsp, socket.client,
			{
			token: "123"
		}); // What consequences is this going to have? Are only events triggered with the cookie?
		Object.assign(this, socket);

		this.playernum = undefined;
	}
}

let pendingMatchRequest: string = undefined;

@WebSocketGateway({cors: true})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private clients: Set<Socket> = new Set();
	private intervalId: NodeJS.Timer;

	constructor(private gameService: GameService, private converter: Converter) {}

	start(gid: string): void {

		this.gameService.createGame(gid);
		
		this.intervalId = setInterval(() => {
			this.gameService.update(gid);
			const gameState: GameState = this.gameService.gameState(gid);
			this.clients.forEach(client => client.emit('gameState', gameState))
		}, 20)
	}

	handleConnection(client: Client) {
		this.clients.add(client);
		
		client.emit('handshake', JSON.stringify(CONFIG));
		
		if (pendingMatchRequest)
		{
			this.converter.add({player2: client.id})
			client.emit('start');
			this.converter.add({gid: pendingMatchRequest, player2: client.id})
			this.start(pendingMatchRequest)
			pendingMatchRequest = undefined;
		}
		else
		{
			this.converter.add({player1: client.id})
			pendingMatchRequest = crypto.randomUUID();
			this.converter.add({gid: pendingMatchRequest, player1: client.id});
		}

		client.on('keydown', keycode => this.gameService.keydown(keycode, client.id));
	
		client.on('disconnect', () => {
			this.handleDisconnect(client);
		})
	}
	
	handleDisconnect(client: Client) {
		if (this.clients.size === 0)
			clearInterval(this.intervalId);
		this.clients.delete(client);
	}
}
