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
const common_1 = require("@nestjs/common");
const bcrypt_1 = require("../../tools/bcrypt");
let ChatGateway = class ChatGateway {
    userservice;
    channelservice;
    messageservice;
    jwtservice;
    configservice;
    server;
    socketToChannels = new Map();
    socket_idToSocket = new Map();
    socket_idToIntra_id = new Map();
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
        if (!user || !usr) {
            socket.disconnect();
        }
        this.socket_idToSocket.set(socket.id, socket);
        this.socket_idToIntra_id.set(socket.id, user.intra_id);
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
        this.socket_idToIntra_id.delete(socket.id);
        socket.disconnect();
        console.log('User disconnected chat');
    }
    async handleMessage(data, socket) {
        try {
            const user = await this.userservice.findUsersById(data.senderId);
            const channel = await this.channelservice.findChannelById(data.channelId);
            if (!this.channelservice.isBanned(channel.id, user)) {
                throw new common_1.ForbiddenException('You are banned from the channel');
            }
            const message = {
                text: data.text,
                sender: user,
                channel: channel,
            };
            const newMessage = await this.messageservice.createMessage(message);
            this.server.to('' + channel.id).emit('getMessage', newMessage);
            return;
        }
        catch (err) {
            return (err.message);
        }
    }
    ;
    async addChannel(channel, socket) {
        try {
            const intra_id = this.socket_idToIntra_id.get(socket.id);
            const user = await this.userservice.findUsersById(intra_id);
            const notBannedUsers = await this.userservice.getnotBannedUsers(user.intra_id);
            const users = [];
            users.push(user);
            for (const userId of channel.usersId) {
                const user = await this.userservice.findUsersById(userId);
                const notBanned = notBannedUsers.some(notbanned => notbanned.intra_id === user.intra_id);
                if (user && notBanned) {
                    users.push(user);
                }
            }
            if (channel.name.length === 0 || (channel.type !== 'private' && channel.type !== 'public' && channel.type !== 'protected'))
                throw new common_1.ForbiddenException('you did something wrong');
            let password = channel.password;
            if (password.length !== 0)
                password = (0, bcrypt_1.encodePassword)(password);
            const newChannel = {
                name: channel.name,
                isDM: false,
                isPrivate: channel.type === 'private' ? true : false,
                password: channel.type === 'protected' ? password : null,
                owner: user,
                users: users,
                administrators: [user],
            };
            const Channel = await this.channelservice.createChannel(newChannel);
            const channelUsers = await this.channelservice.findChannelUsers(Channel.id);
            channelUsers.map(user => {
                const socket_id = this.getSocketIdFromIntraId(user.intra_id);
                const channels = this.socketToChannels.get(socket_id) || [];
                if (channels.length) {
                    const sock = this.socket_idToSocket.get(socket_id);
                    channels.push('' + Channel.id);
                    sock.join('' + Channel.id);
                }
            });
            socket.to('' + Channel.id).emit('updateChannels', '');
            this.server.to(socket.id).emit('updateChannels', Channel.id);
        }
        catch (err) {
            if (err.code === '23505')
                return ('Channel name already exist');
            else
                return (err.message);
        }
    }
    async joinChannel(channelInfo, socket) {
        try {
            const channel = await this.channelservice.findChannelByIdWithUsers(channelInfo.channelId);
            if (!channel)
                throw new common_1.ForbiddenException('No such channel');
            if (channel.password && !(0, bcrypt_1.comparePassword)(channelInfo.password, channel.password))
                throw new common_1.ForbiddenException('Wrong password');
            const intra_id = this.socket_idToIntra_id.get(socket.id);
            const user = await this.userservice.findUsersById(intra_id);
            if (channel.isPrivate && !this.channelservice.isInvited(channel.id, user)) {
                throw new common_1.ForbiddenException('You are not invited');
            }
            if (!this.channelservice.isBanned(channel.id, user)) {
                throw new common_1.ForbiddenException('You are banned from the channel');
            }
            await this.channelservice.addUserToChannel(channel, user);
            const sock = this.socket_idToSocket.get(socket.id);
            const channels = this.socketToChannels.get(socket.id) || [];
            channels.push('' + channel.id);
            sock.join('' + channel.id);
            this.server.to('' + channel.id).emit('updateMembers', '');
            this.server.to('' + socket.id).emit('updateChannels', channel.id);
        }
        catch (err) {
            console.log('error in join channel: ' + err);
            return (err.message);
        }
    }
    getSocketIdFromIntraId(intra_id) {
        for (const [socketId, id] of this.socket_idToIntra_id) {
            if (id === intra_id) {
                return socketId;
            }
        }
        return undefined;
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
    (0, websockets_1.SubscribeMessage)('createChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "addChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinChannel", null);
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