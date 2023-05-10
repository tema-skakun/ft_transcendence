import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "../user/user.service";
import { ChannelService } from "../channel/channel.service";
import { MessageService } from "../message/message.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private userservice;
    private channelservice;
    private messageservice;
    private readonly jwtservice;
    private readonly configservice;
    server: Server;
    private socketToChannels;
    private socket_idToSocket;
    private socket_idToIntra_id;
    constructor(userservice: UserService, channelservice: ChannelService, messageservice: MessageService, jwtservice: JwtService, configservice: ConfigService);
    afterInit(): Promise<void>;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    handleMessage(data: any, socket: Socket): Promise<any>;
    addChannel(channel: any, socket: Socket): Promise<any>;
    joinChannel(channelInfo: any, socket: Socket): Promise<any>;
    getSocketIdFromIntraId(intra_id: number): string;
}
