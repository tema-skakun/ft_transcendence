import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GameService } from './gameService';
import { Client } from '../../classes/client';
import { UserService } from '../user/user.service';
import { MatchHistoryService } from './match-history/match-history.service';
import { ArchivementsService } from '../archivements/archivements.service';
export declare const clients: Map<string, Client>;
export declare const resetGlobalPendingMatch: () => void;
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private gameService;
    private userService;
    private matchHistoryService;
    private jwtService;
    private archivmentService;
    server: Server;
    constructor(gameService: GameService, userService: UserService, matchHistoryService: MatchHistoryService, jwtService: JwtService, archivmentService: ArchivementsService);
    start(player2: Client): void;
    join(client: Client, JoinOpts: Object): Promise<void>;
    handleConnection(socket: Socket): Promise<void>;
    kickoffGroup(inviter: Client, invitee: Client): void;
    handleDisconnect(client: any): void;
}
