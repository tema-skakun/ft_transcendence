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
	private relationalTable: RelationalTable,
	private jwtService: JwtService)
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

  sendResultAndDisconnect({gameState: gameState, player1: player1, player2: player2, gameId: gameId }: {gameState: GameState, player1: Client, player2: Client, gameId: string}) {
		if (gameState.goalsPlayer1 > gameState.goalsPlayer2)
		{
			player1.emit('winner');
			player2.emit('looser');
		} else {
			player1.emit('looser');
			player2.emit('winner');
		}

		// // <Not working yet>
		// this.userRestrictions.switch(false,
		// 	player1.id,
		// 	UserRestriction.user_can_press_keys_in_game_canvas,
		// 	{gameId: gameId}
		// 	)
		// this.userRestrictions.switch(false,
		// 	player2.id,
		// 	UserRestriction.user_can_press_keys_in_game_canvas,
		// 	{gameId: gameId}
		// 	)
		// // </Not working yet>

		setTimeout(async () => {
			player1.disconnect(true); // Why is the handler not working.
			}, 4000) 
  } 

  async handleConnection(socket: Socket): Promise<void> {

	const client: Client = new Client(socket);
	client._digestCookie(socketToCookie(socket), this.jwtService.decode, this.jwtService);
    this.clients.set(client.id, client);

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

  handleDisconnect(client: any) { // Not used because to little parameters.
	this.clients.delete(client.id)
  }

}
