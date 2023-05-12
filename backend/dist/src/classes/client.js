"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClient = exports.Client = void 0;
const socket_io_1 = require("socket.io");
const constants_1 = require("../constants/constants");
const constants_2 = require("../constants/constants");
const game_gateway_1 = require("../modules/game/game.gateway");
const archivments_entity_1 = require("../entities/archivements/archivments.entity");
async function updateMatchHistory(winner, looser, userService, matchHistoryService) {
    const looserEntity = await userService.findUserByIdAndGetRelated(looser.intraId, ['wonGames', 'lostGames']);
    const winnerEntity = await userService.findUserByIdAndGetRelated(winner.intraId, ['wonGames', 'lostGames']);
    console.log(`My intraa id: ${winnerEntity.intra_id}`);
    const matchHistoryEntry = await matchHistoryService.create({
        winner: winnerEntity,
        winnerGoals: winner.goals,
        looser: looserEntity,
        looserGoals: looser.goals
    });
    userService.incr_totalLosses(looserEntity);
    userService.incr_totalWins(winnerEntity);
    console.log(`lost games: ${looserEntity.lostGames.length}`);
    console.log(`intraId: ${looserEntity.intra_id}`);
    matchHistoryService.save(matchHistoryEntry);
}
class Client extends socket_io_1.Socket {
    _inGame = false;
    get inGame() { return this._inGame; }
    set inGame(val) {
        if (this.otherPlayerObj) {
            this.otherPlayerObj.inGameUncoupled = val;
        }
        this.inGameUncoupled = val;
    }
    set inGameUncoupled(val) { this._inGame = val; }
    streak = 0;
    userService;
    matchHistoryService;
    archivmentService;
    _playernum;
    get playernum() {
        return this._playernum;
    }
    set playernum(val) {
        if (this.otherPlayerObj) {
            if (val === 1)
                this.otherPlayerObj.playernumUncoupled = 2;
            else
                this.otherPlayerObj.playernumUncoupled = 1;
        }
        this.playernumUncoupled = val;
    }
    set playernumUncoupled(val) {
        this._playernum = val;
    }
    key;
    _involvedGame;
    set involvedGame(ig) {
        this._involvedGame = ig;
    }
    get involvedGame() {
        if (!this._involvedGame)
            Error('involved Game is undefined at access');
        return this._involvedGame;
    }
    _otherPlayerObj;
    set otherPlayerObj(op) {
        this._otherPlayerObj = op;
        this._otherPlayer = op.id;
        op._otherPlayerObj = this;
        op._otherPlayer = this.id;
    }
    get otherPlayerObj() {
        if (!this._otherPlayerObj)
            Error('Other player obj is undefined');
        return this._otherPlayerObj;
    }
    _otherPlayer;
    get otherPlayer() {
        return (this._otherPlayer);
    }
    listnersToBeCleaned = [];
    cleanUp() {
        for (const listener of this.listnersToBeCleaned) {
            this.off(listener.name, listener.func);
        }
    }
    _gameState;
    set gameState(gs) {
        this._gameState = gs;
        if (this._otherPlayerObj)
            this._otherPlayerObj._gameState = gs;
        else
            throw Error('Other player attribute not set');
    }
    get gameState() {
        return this._gameState;
    }
    _gameLoop;
    set gameLoop(gl) {
        this._gameLoop = gl;
        if (this._otherPlayerObj)
            this._otherPlayerObj._gameLoop = gl;
        else
            throw Error('Other player attribute not set');
    }
    get gameLoop() {
        return this._gameLoop;
    }
    _cookie;
    _intraId;
    set cookie(aCookie) {
        this._cookie = aCookie;
        this._intraId = aCookie.intra_id;
    }
    get cookie() {
        return (this._cookie);
    }
    _pendingMatchRequest;
    async setPendingMatchRequest(uuid) {
        if (this.otherPlayerObj) {
            await this.otherPlayerObj.join(uuid);
            this.otherPlayerObj.pendingMatchRequestUncoupled = uuid;
        }
        await this.join(uuid);
        this.pendingMatchRequestUncoupled = uuid;
    }
    set pendingMatchRequestUncoupled(uuid) {
        this._pendingMatchRequest = uuid;
    }
    get pendingMatchRequest() {
        return this._pendingMatchRequest;
    }
    _goals = 0;
    zero_goals() {
        this.streak = 0;
        this._goals = 0;
    }
    incr_goals() {
        const other = this._otherPlayerObj;
        other.streak = 0;
        ++this.streak;
        if (this.streak === 3) {
            this.emit('tripple streak');
            this.archivmentService.addArchivement(archivments_entity_1.archivement_vals.chad, this.intraId);
            other.emit('tripple loose');
            this.archivmentService.addArchivement(archivments_entity_1.archivement_vals.triggered, other.intraId);
        }
        ++this._goals;
        this.coupledEmits('goal', (this.playernum === 1) ? 'player1' : 'player2');
        if (this._goals === constants_2.default.POINTS) {
            this.emit('winner');
            other.emit('looser');
            updateMatchHistory(this, other, this.userService, this.matchHistoryService);
            this.cancelGame();
        }
    }
    get goals() {
        return this._goals;
    }
    coupledOn(clientEventName, eventFunctionXClient) {
        console.log(`Calling instance: ${this.playernum}`);
        const other = this._otherPlayerObj;
        if (!other)
            throw Error('other player not in here');
        const myEventFunction = eventFunctionXClient(this);
        const otherEventFunction = eventFunctionXClient(other);
        this.onSave(clientEventName, myEventFunction);
        other.onSave(clientEventName, otherEventFunction);
    }
    onSave(eventName, eventFunction) {
        this.listnersToBeCleaned.push({ name: eventName, func: eventFunction });
        this.on(eventName, eventFunction);
    }
    coupledEmits(eventName, data) {
        this.emit(eventName, data);
        if (!this._otherPlayerObj)
            throw Error('no other player on emission');
        else
            this._otherPlayerObj.emit(eventName, data);
    }
    cancelGame() {
        this.cleanUp();
        this.key = constants_1.Key.NoKey;
        this.zero_goals();
        this.otherPlayerObj.zero_goals();
        if (this.gameLoop)
            clearInterval(this.gameLoop);
        this.inGame = false;
        if (!this.otherPlayerObj)
            return;
        this.otherPlayerObj.key = constants_1.Key.NoKey;
        this.otherPlayerObj.inGame = false;
        this.otherPlayerObj.cleanUp();
    }
    tearDown() {
        if (!this._otherPlayerObj) {
            console.log('other player not set');
            (0, game_gateway_1.resetGlobalPendingMatch)();
            return;
        }
        this.cancelGame();
        this.otherPlayerObj.emit('playerDisconnect');
    }
    constructor(socket, userService, matchHistoryService, archivementService) {
        super(socket.nsp, socket.client, {
            token: "123"
        });
        Object.assign(this, socket);
        this.playernum = undefined;
        this.userService = userService;
        this.matchHistoryService = matchHistoryService;
        this.archivmentService = archivementService;
        console.log(`client in: ${this.id}`);
    }
    _digestCookie(cookieStr, decrypthMethod, decryptObj) {
        const searchStr = "accesToken=";
        const jwtToken = cookieStr.slice(searchStr.length + 1);
        const cookieContent = decrypthMethod.bind(decryptObj)(jwtToken);
        if (typeof cookieContent === 'string')
            throw Error('incomplete cookie');
        this.cookie = cookieContent;
        console.log(this._intraId);
    }
    get intraId() {
        return (this._intraId);
    }
}
exports.Client = Client;
function isClient(obj) {
    return (obj.intraId);
}
exports.isClient = isClient;
//# sourceMappingURL=client.js.map