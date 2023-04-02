import { WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';

// <self defined>
import { GameService } from './gameService';
import CONFIG from './constants';
import { RelationalTable, Column } from './tools/converter';
import { Client } from './classes/client';
import { throwIfEmpty } from 'rxjs';
// </self defined>

interface DisconnectParams {
	client: Client;
	gameId: string;
	socketsInRoom: Set<Client>; 
}

let pendingMatchRequest: string = undefined;

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  // <state>
  @WebSocketServer() server: Server;
  private clients: Map<string, Client>;
  private runningGames: Map<string, NodeJS.Timer>;
  // </state>

  constructor(private gameService: GameService, private relationalTable: RelationalTable) {
    this.runningGames = new Map<string, NodeJS.Timer>();
    this.clients = new Map<string, Client>();
  }

  // note: communicating to service over relationalTable sigleton instance
  start(gameId: string, clientsInRoom: Set<Client>): void {
    this.gameService.createGame(gameId);

	// <Loop>
		const intervalId: NodeJS.Timer = setInterval(() => {
		this.gameService.update(gameId);
		const column: Column = this.relationalTable.getRelation(gameId);

		// <Emission>
		clientsInRoom.forEach((client: Client) => {
			client.emit('gameState', JSON.stringify(column.gameState));
		})
		// </Emission>

		}, CONFIG.UPDATE_INTERVAL)
	// </Loop>

    this.runningGames.set(gameId, intervalId);
  }

  async handleConnection(socket: Socket): Promise<void> {
    const client: Client = new Client(socket);
    this.clients.set(client.id, client);
    const socketsInRoom: Set<Client> = new Set<Client>();

    let gameId: string;

    const namespace = client.nsp;

    client.emit('handshake', JSON.stringify(CONFIG));

    client.on('keydown', keyCode => {
      this.gameService.keydown(keyCode, client.id, gameId);
    });

    client.on('disconnect', () => {
      this.handleClientDisconnect({ client: client, gameId: gameId, socketsInRoom: socketsInRoom });
    })

    if (pendingMatchRequest) {
      this.relationalTable.addRelation(pendingMatchRequest, { player2: client.id });
      client.join(pendingMatchRequest);

	  // Finit: sockets in room
	  {
		const socketIdsInRoom: Set<string> = await namespace.adapter.sockets(new Set<string>([pendingMatchRequest]));
		socketIdsInRoom.forEach((socketId: string) => {
			socketsInRoom.add(this.clients.get(socketId));
		})
	  }

      this.start(pendingMatchRequest, socketsInRoom);
      gameId = pendingMatchRequest;
      pendingMatchRequest = undefined;
    } else {
      pendingMatchRequest = crypto.randomUUID();
      gameId = pendingMatchRequest;
      client.join(gameId);
      this.relationalTable.addRelation(pendingMatchRequest, { player1: client.id });
    }

	this.registerEventListeners(client, () => gameId, socketsInRoom)
  }


  handleClientDisconnect({ client, gameId, socketsInRoom }: DisconnectParams) {
    console.log(`Client id out: ${client.id}`)

    socketsInRoom.forEach((client: Client) => {
      client.emit('playerLeft');
      client.disconnect(true);
    })

    clearInterval(this.runningGames.get(gameId)); // Stops the emission of game States, event for frontend required
    this.runningGames.delete(gameId);
    this.clients.delete(client.id);
    this.relationalTable.removeRelation(gameId);
  }
  
  private registerEventListeners(client: Client, getGameId: () => string, socketsInRoom: Set<Client>) {
	const namespace = client.nsp;
  
	client.emit('handshake', JSON.stringify(CONFIG));
  
	client.on('keydown', keycode => {
	  this.gameService.keydown(keycode, client.id, getGameId());
	});
  
	client.on('disconnect', () => {
	  this.handleClientDisconnect({ client: client, gameId: getGameId(), socketsInRoom: socketsInRoom });
	});
  }

  handleDisconnect(client: any) {
  }

}
