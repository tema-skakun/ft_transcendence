import { WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

// <self defined>
import { GameService } from './gameService';
import CONFIG from '../../constants/constants';
import { RelationalTable, Column } from '../../tools/converter';
import { Client, isClient } from '../../classes/client';

import { roomToSocket, setOtherPlayer, socketToCookie } from 'src/tools/trivial';
import { GameState } from 'src/interfaces/GameState';
import { DisconnectParams } from 'src/interfaces/VariousParams';
import { json } from 'stream/consumers';
import { arrayNotEmpty } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { UserService } from '../user/user.service';
import { MatchHistoryService } from './match-history/match-history.service';
import { ArchivementsService } from '../archivements/archivements.service';
// </self defined>

type KeyHandler = (...args: any[]) => void;
type KeyHandlerXClient = (player: Client) => KeyHandler; 

let pendingMatchRequest: string = undefined;
export const resetGlobalPendingMatch = () => {pendingMatchRequest = undefined}

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	namespace: '/game',
	path: '/gameListener',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  // <state>
  @WebSocketServer() server: Server;
  private clients: Map<string, Client>;
  // </state>

  constructor(private gameService: GameService,
	private userService: UserService,
	private matchHistoryService: MatchHistoryService,
	private jwtService: JwtService,
	private archivmentService: ArchivementsService)
	{
		this.clients = new Map<string, Client>();

	}

  // note: communicating to service over relationalTable sigleton instance
  start(player2: Client): void {

		// <streamline>
		const keyHandlerXClientFactory = (activate: boolean): KeyHandlerXClient  => {
				return (player: Client) => (code: string) => {
					this.gameService.keyChange(code, player, activate);
				}
		}
		const player1: Client = player2.otherPlayerObj;
		// </streamline>

		this.gameService.createGame(player2);

		// <eventHandlers>
			player2.coupledOn('keydown', keyHandlerXClientFactory(true));
			player2.coupledOn('keyup', keyHandlerXClientFactory(false));
		// </eventHandlers>

	// <Loop>
		player2.gameLoop = setInterval(async () => {
		this.gameService.physics(player2);

		// <Emission>
		player2.coupledEmits('gameState', JSON.stringify(player2.gameState));

		const goals: string = this.gameService.goals(player2);
		if (goals === 'goal player1')
			player1.incr_goals();
		else if (goals === 'goal player2')
			player2.incr_goals();
		// </Emission>

		}, CONFIG.UPDATE_INTERVAL)
	// </Loop>
  }

  async join(client: Client, JoinOpts: Object) {

    if (pendingMatchRequest) {
		client.playernum = 2;
		await client.setPendingMatchRequest(pendingMatchRequest);
  
		await setOtherPlayer.bind(this)(client);
  
		this.start(client);
		pendingMatchRequest = undefined;
  
	  } else { 
		client.playernum = 1;
		console.log(`playernum: ${client.playernum}`); 
  
		pendingMatchRequest = crypto.randomUUID();
		await client.setPendingMatchRequest(pendingMatchRequest);
	  }
  
	  client.emit('handshake', JSON.stringify(CONFIG));
	  client.on('disconnect', () => {
		  console.log(`client out (ignore doubles): ${client.id}`);
		  client.tearDown();
	  })
  }

  async handleConnection(socket: Socket): Promise<void> { // Lobby

	const client: Client = new Client(socket, this.userService, this.matchHistoryService, this.archivmentService);
	client._digestCookie(socketToCookie(socket), this.jwtService.decode, this.jwtService);
    this.clients.set(client.id, client);

	// Waiting for 'join' event.
	const joinCb = (JoinOptsStr: string) => {
		client.off('join', joinCb);
		const JoinOpts: Object = JSON.parse(JoinOptsStr);
		this.join(client, JoinOpts);
	}

	client.on('join', joinCb);

	client.on('disconnect', () => {
		console.log(`client out (ignore doubles): ${client.id}`);
		client.tearDown();
	})
  }

  handleDisconnect(client: any) { // Not used because to little parameters.
	this.clients.delete(client.id)
  }

}
