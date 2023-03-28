import { WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, SubscribeMessage, MessageBody} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { GameService } from './gameService';
import { GameState } from './gameService';
import CONFIG from './constants';

import { RelationalTable } from './converter';
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

// export let debuggingClientId: string = undefined;

let pendingMatchRequest: string = undefined;

@WebSocketGateway({cors: true})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private clients: Set<Client> = new Set();
	private intervalId: NodeJS.Timer;

	constructor(private gameService: GameService, private relations: RelationalTable) {}

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
		let gid: string;
		
		client.emit('handshake', JSON.stringify(CONFIG));;
		
		if (pendingMatchRequest)
		{
			this.relations.addRelation(pendingMatchRequest, {player2: client.id});

			client.emit('start');
			this.clients.forEach( client1 => {
				if (client1.id === this.relations.getRelation(pendingMatchRequest).player1)
				{
					client1.emit('start');
				}
			})

			this.start(pendingMatchRequest)
			gid = pendingMatchRequest;
			pendingMatchRequest = undefined;
		}
		else
		{
			pendingMatchRequest = crypto.randomUUID();
			gid = pendingMatchRequest;
			this.relations.addRelation(pendingMatchRequest, {player1: client.id});
		}

		client.on('keydown', keycode => {
			this.gameService.keydown(keycode, client.id, gid);
		});
	
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
