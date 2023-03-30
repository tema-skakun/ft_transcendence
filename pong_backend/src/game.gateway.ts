import { WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, SubscribeMessage, MessageBody} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { GameService } from './gameService';
import CONFIG from './constants';

import { RelationalTable, Column } from './converter';
import * as math from 'mathjs';

class Client extends Socket {
	public playernum: number;
	constructor(socket: Socket) {
		super(socket.nsp, socket.client,
			{
			token: "123"
		});
		Object.assign(this, socket);

		this.playernum = undefined;
	}
}

let pendingMatchRequest: string = undefined;

@WebSocketGateway({cors: true})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private clients: Set<Client> = new Set();
	private runningGames: Map<string, NodeJS.Timer>;

	constructor(private gameService: GameService, private relations: RelationalTable) {
		this.runningGames = new Map<string, NodeJS.Timer>();
	}

	start(gid: string): void {
		this.gameService.createGame(gid);
		
		const intervalId: NodeJS.Timer = setInterval(() => {
			this.gameService.update(gid);
			const column: Column = this.relations.getRelation(gid);
			this.clients.forEach( client => {
				if (client.id === column.player1 || client.id === column.player2)
				{
					client.emit('gameState' ,column.gameState)
				}
			})
		}, CONFIG.UPDATE_INTERVAL)

		this.runningGames.set(gid, intervalId);
	}

	handleConnection(client: Client) {
		this.clients.add(client);
		let gid: string;
		
		client.emit('handshake', JSON.stringify(CONFIG));
		
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
			this.handleDisconnect({client: client, gid: gid});
		})
	}
	
	handleDisconnect({client, gid}: {client: Client, gid: string}) {
		if (this.clients.size === 0)
			clearInterval(this.runningGames.get(gid));
		this.clients.delete(client);
	}
}
