import { Socket } from 'socket.io';
import { GameState } from 'src/interfaces/GameState';

import { Key } from 'src/constants/constants';
import CONFIG from '../constants/constants';
import { resetGlobalPendingMatch } from 'src/modules/game/game.gateway';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/entities';
import { MatchHistoryService } from 'src/modules/game/match-history/match-history.service';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';

type EventFunction = (...args: any[]) => void;
type EventFunctionXClient = (player: Client) => EventFunction;

async function updateMatchHistory(winner: Client, looser: Client, userService: UserService, matchHistoryService: MatchHistoryService) {
	const looserEntity: User = await userService.findUserByIdAndGetRelated(looser.intraId, ['wonGames', 'lostGames']);
	const winnerEntity: User = await userService.findUserByIdAndGetRelated(winner.intraId, ['wonGames', 'lostGames']);

	const matchHistoryEntry: MatchHistoryEntry = await matchHistoryService.create({
		winner: winnerEntity,
		winnerGoals: winner.goals,
		looser: looserEntity,
		looserGoals: looser.goals
	})

	matchHistoryService.save(matchHistoryEntry);
}

export class Client extends Socket {
	
	// <services>
	private userService: UserService;
	private matchHistoryService: MatchHistoryService;
	// </services>

	// <outsourcing>
	public playernum: number;
	
	public key: Key;
	// </outsourcing>
	
	// <shared>
	private _involvedGame: string;
	set involvedGame(ig: string)
	{
		this._involvedGame = ig;
	}
	get involvedGame(): string {
		if (!this._involvedGame)
			Error('involved Game is undefined at access');
		return this._involvedGame;
	}

	private _otherPlayerObj: Client;
	set otherPlayerObj(op: Client) {
		this._otherPlayerObj = op;
		this._otherPlayer = op.id;

		op._otherPlayerObj = this;
		op._otherPlayer = this.id;
	}
	get otherPlayerObj(): Client {
		if (!this._otherPlayerObj)
			Error('Other player obj is undefined');
		return this._otherPlayerObj;
	}

	private _otherPlayer: string; // gets set when _otherPlayerObj is set.
	get otherPlayer(): string {
		return (this._otherPlayer);
	}

	private _cleanupHandlers: EventFunction [] = [];
	set cleanupHandlers(newCleanup: EventFunction) {
		this._cleanupHandlers.push(newCleanup);
		if (this._otherPlayerObj)
			this._otherPlayerObj._cleanupHandlers.push(newCleanup);
		else
			throw Error('Other player attribute not set');
	}

	private _gameState: GameState;
	set gameState(gs: GameState) {
		this._gameState = gs;
		if (this._otherPlayerObj)
			this._otherPlayerObj._gameState = gs;
		else
			throw Error('Other player attribute not set');
	}
	get gameState(): GameState {
		return this._gameState;
	}

	private _gameLoop: NodeJS.Timer;
	set gameLoop(gl: NodeJS.Timer)
	{
		this._gameLoop = gl;
		if (this._otherPlayerObj)
			this._otherPlayerObj._gameLoop = gl;
		else
			throw Error('Other player attribute not set');
	}
	get gameLoop(): NodeJS.Timer | undefined {
		return this._gameLoop;
	}
	// </shared>
	
	// <coupled action>
	private _cookie: Record<string, any>;
	private _intraId: number;
	set cookie(aCookie: Record<string, any>) {
		this._cookie = aCookie;
		this._intraId = aCookie.id;
	}
	get cookie(): Record<string, any> {
		return (this._cookie);
	}

	private _pendingMatchRequest: string;
	async setPendingMatchRequest(uuid: string) {
		await this.join(uuid);
		this._pendingMatchRequest = uuid;
	}
	get pendingMatchRequest(): string {
		return this._pendingMatchRequest;
	}

	private _goals: number = 0;
	incr_goals() {
		const other: Client = this._otherPlayerObj;

		++this._goals;
		this.coupledEmits('goal', (this.playernum === 1) ? 'player1' : 'player2' );
		if (this._goals === CONFIG.POINTS)
		{
			this.emit('winner');
			other.emit('looser');

			updateMatchHistory(this, other, this.userService, this.matchHistoryService);

			this.disconnect();
		}
	}
	get goals(): number {
		return this._goals;
	}

	coupledOn(clientEventName: string, eventFunctionXClient: EventFunctionXClient)
	{
		// <Destructuring>
		const other: Client = this._otherPlayerObj;
		if (!other)
			Error('other player not in here');
		const myEventFunction: EventFunction = eventFunctionXClient(this);
		const otherEventFunction: EventFunction = eventFunctionXClient(other);
		// </Destructuring>

		// <Register for deactivation>
		this.cleanupHandlers = myEventFunction;
		other.cleanupHandlers = otherEventFunction;
		// </Register for deactivation>

		this.on(clientEventName, myEventFunction);
		other.on(clientEventName, otherEventFunction);
	}

	coupledEmits(eventName: string, data: string) {
		this.emit(eventName, data);
		if (!this._otherPlayerObj)
			throw Error('no other player on emission');
		else
			this._otherPlayerObj.emit(eventName, data);
	}
	// </coupled action>
  
	tearDown() {
		if (this.gameLoop)
			clearInterval(this.gameLoop);
		if (!this._otherPlayerObj)
		{
			resetGlobalPendingMatch();
			return ;
		}
		if (!this._otherPlayerObj.disconnected)
			this._otherPlayerObj.disconnect();
	}

	constructor(socket: Socket, userService: UserService, matchHistoryService: MatchHistoryService) {
	  super(socket.nsp, socket.client, {
		token: "123"
	  });
	  Object.assign(this, socket);
  
	  this.playernum = undefined;
	  this.userService = userService;
	  this.matchHistoryService = matchHistoryService;
  
	  console.log(`client in: ${this.id}`);
	}

	_digestCookie(cookieStr: string, decrypthMethod: any, decryptObj: any) {
		const searchStr: string = "accesToken=";
		const jwtToken: string = cookieStr.slice(searchStr.length + 1);
		const cookieContent: string | Record<string, any> = decrypthMethod.bind(decryptObj)(jwtToken);
		if (typeof cookieContent === 'string')
			throw Error('incomplete cookie');
		
		this.cookie = cookieContent;
	}

	get intraId(): number {
		return (this._intraId);
	}

  }


export function isClient(obj: any): obj is Client {
	return (obj.intraId);
}