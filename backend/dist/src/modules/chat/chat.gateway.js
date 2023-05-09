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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_service_1 = require("../user/user.service");
const channel_service_1 = require("../channel/channel.service");
const message_service_1 = require("../message/message.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let ChatGateway = class ChatGateway {
    userservice;
    channelservice;
    messageservice;
    jwtservice;
    configservice;
    server;
    socketToChannels = new Map();
    socket_idToSocket = new Map();
    constructor(userservice, channelservice, messageservice, jwtservice, configservice) {
        this.userservice = userservice;
        this.channelservice = channelservice;
        this.messageservice = messageservice;
        this.jwtservice = jwtservice;
        this.configservice = configservice;
    }
    async afterInit() {
        console.log('WebSocket gateway initialized! ');
    }
    async handleConnection(socket) {
        const accessToken = String(socket.handshake.query.accessToken);
        const secret = { secret: this.configservice.get('JWT_SECRET_KEY') };
        const usr = await this.jwtservice.verify(accessToken, secret);
        const user = await this.userservice.findUsersById(usr.intra_id);
        if (!user) {
            socket.disconnect();
        }
        if (user.socket_id) {
            const sock = this.socket_idToSocket.get(user.socket_id);
            if (!sock) {
                await this.userservice.updateUserSocket(user.intra_id, null);
            }
            else {
                await this.handleDisconnect(sock);
            }
        }
        await this.userservice.updateUserSocket(user.intra_id, socket.id);
        this.socket_idToSocket.set(socket.id, socket);
        const userChannels = await this.channelservice.findUserChannels(user.intra_id);
        const channelIds = userChannels.map(channel => {
            socket.join(String(channel.id));
            return String(channel.id);
        });
        await Promise.all(channelIds);
        this.socketToChannels.set(socket.id, channelIds);
        console.log('User connected chat ');
    }
    async handleDisconnect(socket) {
        const channels = this.socketToChannels.get(socket.id) || [];
        channels.forEach((channelId) => {
            socket.leave(channelId);
        });
        this.socketToChannels.delete(socket.id);
        this.socket_idToSocket.delete(socket.id);
        const user = await this.userservice.findUniqueBySocket(socket.id);
        if (user) {
            await this.userservice.updateUserSocket(user.intra_id, null);
            socket.disconnect();
        }
        console.log('User disconnected chat');
    }
    async handleMessage(data, socket) {
        socket.to('' + data.channel.id).emit('getMessage', data);
        console.log('message is sent');
    }
    ;
    async addChannel(channelId, socket) {
        const channelUsers = await this.channelservice.findChannelUsers(channelId);
        channelUsers.map(user => {
            const channels = this.socketToChannels.get(user.socket_id) || [];
            if (channels.length) {
                const sock = this.socket_idToSocket.get(user.socket_id);
                channels.push('' + channelId);
                sock.join('' + channelId);
            }
        });
        socket.to('' + channelId).emit('updateChannels', '');
        this.server.to(socket.id).emit('updateChannels', channelId);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('addChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "addChannel", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
        },
        namespace: '/chat'
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        channel_service_1.ChannelService,
        message_service_1.MessageService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map