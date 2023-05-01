import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "../user/user.service";
import { ChannelService } from "../channel/channel.service";
import { MessageService } from "../message/message.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { type } from "os";
import { string } from "mathjs";


@WebSocketGateway({
	cors: {
		origin: true,
	},
	namespace: '/chat'
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private socketToChannels = new Map<string, string[]>();
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
		const user = await this.jwtservice.verify(accessToken, secret);
		if (!user) {
			socket.disconnect();
		}
		const userChannels = await this.channelservice.findUserChannels(user.intra_id);
		const channelIds = userChannels.map(channel => {
			socket.join(String(channel.id));
			return String(channel.id);
		  });
		await Promise.all(channelIds);
		this.socketToChannels.set(socket.id, channelIds);

		  
		console.log('User connected: ');
	}

	async handleDisconnect(socket: Socket) {
		const channels = this.socketToChannels.get(socket.id) || [];
		channels.forEach((channelId) => {
			socket.leave(channelId);
		});
		this.socketToChannels.delete(socket.id);
		console.log('User disconnected');
	}

	@SubscribeMessage('sendMessage')
	async handleMessage(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
		socket.to('' + data.channel.id).emit('getMessage', data);
		console.log('message is sent');
	};
	
}