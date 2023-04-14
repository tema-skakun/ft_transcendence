import { WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

// <self defined>
import { GameService } from './gameService';
import CONFIG from '../../constants/constants';
import { RelationalTable, Column } from '../../tools/converter';
import { Client } from '../../classes/client';
import { throwIfEmpty } from 'rxjs';
import { AccessorNode, string } from 'mathjs';
import { DebugService } from '../../debug/debug.service';
import { Inject, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { eventNames } from 'process';
import { UserRestriction } from 'src/classes/UserRestriction';
// </self defined>

interface DisconnectParams {
	client: Client;
	gameId: string;
	socketsInRoom: Set<Client>; 
}

@Injectable()
export class Accessor {
	private internalPendingMatchRequest: string;

	constructor (
		private debug: DebugService
	) {
		this.internalPendingMatchRequest = undefined;
		debug.add(() => {
			return {
				key: "PendingMatchRequest",
				value: this.internalPendingMatchRequest
			}
		})
	}

	get pendingMatchRequest(): string {
		return this.internalPendingMatchRequest;
	}

	set pendingMatchRequest(newValue) {
		this.internalPendingMatchRequest = newValue;
	}
}

export type eventFunction = (client: Client) => void;

@WebSocketGateway({
	cors: {
		origin: true,
	},
	namespace: '/game'
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  // <state>
  @WebSocketServer() server: Server;
  private clients: Map<string, Client>;
  private runningGames: Map<string, NodeJS.Timer>;

  private events: eventFunction [];
  // </state>

  constructor(private gameService: GameService,
	private relationalTable: RelationalTable,
	private accessor: Accessor,
	private debug: DebugService,
	private userRestrictions: UserRestriction)
	{
		this.runningGames = new Map<string, NodeJS.Timer>();
		this.clients = new Map<string, Client>();
		this.events = [];

		this.debug.add(() => {
			let acc: string [] = [];
			for (const client of this.clients)
			{
				acc.push(client[0])
			}
			return {
				key: "Clients",
				value: JSON.stringify(acc)
			};
		})

		this.debug.add(() => {
			let acc: string [] = [];
			for (const game of this.runningGames)
			{
				acc.push(game[0])
			}
			return {
				key: "RunningGames",
				value: JSON.stringify(acc)
			};
		})
	}

	newCallback(cb: eventFunction) {
		this.events.push(cb);
	}

  // note: communicating to service over relationalTable sigleton instance
  start(gameId: string, clientsInRoom: Set<Client>): void {
    this.gameService.createGame(gameId);

	// <Loop>
		const intervalId: NodeJS.Timer = setInterval(() => {
		this.gameService.physics(gameId);
		const column: Column = this.relationalTable.getRelation(gameId);

		// <Emission>
		clientsInRoom.forEach((client: Client) => {
			client.emit('gameState', JSON.stringify(column.gameState));
		})

		const gameActions: string = this.gameService.gameActions(gameId);
		if (gameActions === 'goal player1')
		{
			clientsInRoom.forEach((client: Client) => {
				client.emit('goal', 'player1');
			})
		}
		else if (gameActions === 'goal player2')
		{
			clientsInRoom.forEach((client: Client) => {
				client.emit('goal', 'player2');
			})
		}
		// </Emission>

		}, CONFIG.UPDATE_INTERVAL)
	// </Loop>

    this.runningGames.set(gameId, intervalId);
  }

  async handleConnection(socket: Socket): Promise<void> {
    const client: Client = new Client(socket);
    this.clients.set(client.id, client);

	this.userRestrictions.attachStateSwitch(client.id, UserRestriction.user_can_press_keys_in_game_canvas,
		(newState: boolean, clientId: string, props: {gameId: string}) => {

			if (newState) {
				client.on('keyDown', (code: string) => {
					this.gameService.keyDown(code, client.id, props.gameId);
				  });
			}
			else {
				client.off('keyDown', (code: string) => {
					this.gameService.keyDown(code, client.id, props.gameId);
				  });
			}
		}, false);

    const socketsInRoom: Set<Client> = new Set<Client>();
	let gameId: string = String();

	// LOGGER.debug(`Client ${client.id} registered`);

    const namespace = client.nsp;

    if (this.accessor.pendingMatchRequest) {
      this.relationalTable.addRelation(this.accessor.pendingMatchRequest, { player2: client.id });
      client.join(this.accessor.pendingMatchRequest);

	  // Finit: sockets in room
	  {
		const socketIdsInRoom: Set<string> = await namespace.adapter.sockets(new Set<string>([this.accessor.pendingMatchRequest]));
		socketIdsInRoom.forEach((socketId: string) => {
			socketsInRoom.add(this.clients.get(socketId));
		})
	  }

      this.start(this.accessor.pendingMatchRequest, socketsInRoom);
	  gameId = this.accessor.pendingMatchRequest; // global state -> client state
      this.accessor.pendingMatchRequest = undefined;
    } else {
      this.accessor.pendingMatchRequest = crypto.randomUUID();
	  gameId = this.accessor.pendingMatchRequest; // global state -> client state
      client.join(this.accessor.pendingMatchRequest);
      this.relationalTable.addRelation(this.accessor.pendingMatchRequest, { player1: client.id });
    }

	this.registerEventListeners(client, () => gameId, socketsInRoom)
  }


  handleClientDisconnect({ client, gameId, socketsInRoom }: DisconnectParams) {
    console.log(`Client id out: ${client.id}`)

	// LOGGER.debug(`Client ${client.id} left`);

	if (gameId === this.accessor.pendingMatchRequest)
		this.accessor.pendingMatchRequest = undefined;
    socketsInRoom.forEach((client: Client) => {
      client.emit('playerLeft');
      client.disconnect(true);
    })

    clearInterval(this.runningGames.get(gameId)); // Stops the emission of game States, event for frontend required
    this.runningGames.delete(gameId);
    this.clients.delete(client.id);
    setTimeout(() => this.relationalTable.removeRelation(gameId), 0); // So that no game state callbacks are in the queue.
  }
  
  private registerEventListeners(client: Client, getGameId: () => string, socketsInRoom: Set<Client>) {
	const namespace = client.nsp;

	for (const eventFunc of this.events) {
		eventFunc(client)
	}
  
	client.emit('handshake', JSON.stringify(CONFIG));
  
	// client.on('keyDown', (code: string) => {
	//   this.gameService.keyDown(code, client.id, getGameId());
	// });
  
	client.on('disconnect', () => {
      client.offAny();
	  this.handleClientDisconnect({ client: client, gameId: getGameId(), socketsInRoom: socketsInRoom });
	});
  }

  handleDisconnect(client: any) {
  }

}
