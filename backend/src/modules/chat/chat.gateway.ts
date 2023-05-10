import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "../user/user.service";
import { ChannelService } from "../channel/channel.service";
import { MessageService } from "../message/message.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { type } from "os";
import { string } from "mathjs";
import { Channel } from "src/entities/channel/channel.entity";
import { use } from "passport";
import { ForbiddenException } from "@nestjs/common";
import { comparePassword, encodePassword } from "src/tools/bcrypt";
import { channel } from "diagnostics_channel";


@WebSocketGateway({
	cors: {
		origin: true,
	},
	namespace: '/chat'
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private socketToChannels = new Map<string, string[]>();
	private socket_idToSocket = new Map<string, Socket>();
	private socket_idToIntra_id = new Map<string, number>();
	
	constructor(
		private userservice: UserService,
		private channelservice: ChannelService,
		private messageservice: MessageService,
		private readonly jwtservice: JwtService,
		private readonly configservice: ConfigService,
	) {}
	
	async afterInit() {
		console.log('WebSocket gateway initialized! ');
	}
	  
	async handleConnection(socket: Socket) {
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

	async handleDisconnect(socket: Socket) {
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

	@SubscribeMessage('sendMessage')
	async handleMessage(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
		try {
			const user = await this.userservice.findUsersById(data.senderId);
			const channel = await this.channelservice.findChannelById(data.channelId);
			if (!this.channelservice.isBanned(channel.id, user)) {
				throw new ForbiddenException('You are banned from the channel');
			}
			const message = {
				text: data.text,
				sender: user,
				channel: channel,
			}
			const newMessage = await this.messageservice.createMessage(message);
			this.server.to('' + channel.id).emit('getMessage', newMessage);
			return ;
		} catch(err) {
			return(err.message);
		}
	};

	@SubscribeMessage('createChannel')
	async addChannel(@MessageBody() channel: any, @ConnectedSocket() socket: Socket) {
		try {
			const intra_id = this.socket_idToIntra_id.get(socket.id);
			const user = await this.userservice.findUsersById(intra_id);
			const notBannedUsers = await this.userservice.getnotBannedUsers(user.intra_id);
			const users = [];
			users.push(user);
			for (const userId of channel.usersId) {
				const user = await this.userservice.findUsersById(userId);
				const notBanned = notBannedUsers.some(notbanned => notbanned.intra_id === user.intra_id)
				if (user && notBanned) {
				  users.push(user);
				}
			}
			if (channel.name.length === 0 || (channel.type !== 'private' && channel.type !== 'public' && channel.type !== 'protected'))
				throw new ForbiddenException('you did something wrong');
			let password = channel.password;
			if(password.length !== 0)
      			password = encodePassword(password);
			const newChannel = {
				name: channel.name,
				isDM: false,
				isPrivate: channel.type === 'private' ? true : false,
				password: channel.type === 'protected' ? password : null,
				owner: user,
				users: users,
				administrators: [user],
			}
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
			})
			socket.to('' + Channel.id).emit('updateChannels', '');
			this.server.to(socket.id).emit('updateChannels', Channel.id);
		}catch(err) {
			if (err.code === '23505')
				return ('Channel name already exist');
			else
				return(err.message);
		}

	}

	@SubscribeMessage('joinChannel')
	async joinChannel(@MessageBody() channelInfo: any, @ConnectedSocket() socket: Socket) {
		try {
			const channel = await this.channelservice.findChannelByIdWithUsers(channelInfo.channelId);
			if (!channel)
				throw new ForbiddenException('No such channel');
			if (channel.password && !comparePassword(channelInfo.password, channel.password))
				throw new ForbiddenException('Wrong password');
			const intra_id = this.socket_idToIntra_id.get(socket.id);
			const user = await this.userservice.findUsersById(intra_id);
			if (channel.isPrivate && !this.channelservice.isInvited(channel.id, user)) {
				throw new ForbiddenException('You are not invited');
			}
			if (!this.channelservice.isBanned(channel.id, user)) {
				throw new ForbiddenException('You are banned from the channel');
			}
			await this.channelservice.addUserToChannel(channel, user);
			const sock = this.socket_idToSocket.get(socket.id);
			const channels = this.socketToChannels.get(socket.id) || [];
			channels.push('' + channel.id);
			sock.join('' + channel.id);
			this.server.to('' + channel.id).emit('updateMembers', '');
			this.server.to('' + socket.id).emit('updateChannels', channel.id);
		} catch (err) {
			console.log('error in join channel: ' + err);
			return (err.message);
		}
		
	}

	getSocketIdFromIntraId(intra_id: number) {
		for (const [socketId, id] of this.socket_idToIntra_id) {
			if (id === intra_id) {
				return socketId;
			}
		}
		return undefined; // If the intraId is not found in the map
	}
}
