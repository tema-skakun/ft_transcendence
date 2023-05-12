"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = exports.resetGlobalPendingMatch = exports.clients = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const gameService_1 = require("./gameService");
const constants_1 = require("../../constants/constants");
const crypto = require("crypto");
const client_1 = require("../../classes/client");
const trivial_1 = require("../../tools/trivial");
const user_service_1 = require("../user/user.service");
const match_history_service_1 = require("./match-history/match-history.service");
const archivements_service_1 = require("../archivements/archivements.service");
exports.clients = new Map();
let pendingMatchRequest = undefined;
const resetGlobalPendingMatch = () => { pendingMatchRequest = undefined; };
exports.resetGlobalPendingMatch = resetGlobalPendingMatch;
let GameGateway = class GameGateway {
    gameService;
    userService;
    matchHistoryService;
    jwtService;
    archivmentService;
    server;
    constructor(gameService, userService, matchHistoryService, jwtService, archivmentService) {
        this.gameService = gameService;
        this.userService = userService;
        this.matchHistoryService = matchHistoryService;
        this.jwtService = jwtService;
        this.archivmentService = archivmentService;
    }
    start(player2) {
        player2.inGame = true;
        const keyHandlerXClientFactory = (activate) => {
            return (player) => (code) => {
                this.gameService.keyChange(code, player, activate);
            };
        };
        const player1 = player2.otherPlayerObj;
        this.gameService.createGame(player2);
        player2.coupledOn('keydown', keyHandlerXClientFactory(true));
        player2.coupledOn('keyup', keyHandlerXClientFactory(false));
        player2.gameLoop = setInterval(async () => {
            this.gameService.physics(player2);
            player2.coupledEmits('gameState', JSON.stringify(player2.gameState));
            const goals = this.gameService.goals(player2);
            if (goals === 'goal player1') {
                player1.incr_goals();
                console.log('emitted one goal for player1');
            }
            else if (goals === 'goal player2') {
                player2.incr_goals();
                console.log('emitted one goal for player2');
            }
        }, constants_1.default.UPDATE_INTERVAL);
    }
    async join(client, JoinOpts) {
        if (pendingMatchRequest) {
            client.playernum = 2;
            await client.setPendingMatchRequest(pendingMatchRequest);
            await (0, trivial_1.setOtherPlayer)(client, exports.clients);
            this.start(client);
            pendingMatchRequest = undefined;
        }
        else {
            client.playernum = 1;
            console.log(`playernum: ${client.playernum}`);
            pendingMatchRequest = crypto.randomUUID();
            await client.setPendingMatchRequest(pendingMatchRequest);
        }
        client.emit('handshake', JSON.stringify(constants_1.default));
    }
    async handleConnection(socket) {
        const client = new client_1.Client(socket, this.userService, this.matchHistoryService, this.archivmentService);
        client._digestCookie((0, trivial_1.socketToCookie)(socket), this.jwtService.decode, this.jwtService);
        exports.clients.set(client.id, client);
        const joinCb = (JoinOptsStr) => {
            const JoinOpts = JSON.parse(JoinOptsStr);
            this.join(client, JoinOpts);
        };
        client.on('invite', (intraIdStr, callback) => {
            exports.clients.forEach((cl) => {
                if ((cl.intraId === intraIdStr) && (client.id !== cl.id)) {
                    cl.emit('inviteReq', client.intraId, (resToServer) => {
                        if (resToServer === 'I will destory you') {
                            client.off('join', joinCb);
                            cl.off('join', joinCb);
                            this.kickoffGroup(client, cl);
                        }
                        callback(resToServer);
                    });
                }
            });
        });
        client.on('join', joinCb);
        client.on('disconnect', () => {
            client.inGame = false;
            client.tearDown();
        });
    }
    kickoffGroup(inviter, invitee) {
        inviter.otherPlayerObj = invitee;
        inviter.playernum = 2;
        inviter.setPendingMatchRequest(crypto.randomUUID());
        inviter.coupledEmits('handshake', JSON.stringify(constants_1.default));
        this.start(inviter);
    }
    handleDisconnect(client) {
        exports.clients.delete(client.id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: (origin, callback) => {
                const isOriginAllowed = true;
                callback(null, isOriginAllowed);
            },
            credentials: true
        },
        namespace: '/game',
        path: '/gameListener',
    }),
    __metadata("design:paramtypes", [gameService_1.GameService,
        user_service_1.UserService,
        match_history_service_1.MatchHistoryService,
        jwt_1.JwtService,
        archivements_service_1.ArchivementsService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map