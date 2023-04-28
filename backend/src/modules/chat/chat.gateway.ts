import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway({
	cors: {
		origin: true,
	},
	namespace: '/chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	async handleConnection(socket: Socket) {
		console.log('User connected');
	}

	async handleDisconnect(socket: Socket) {
		console.log('User disconnected');
	}

	@SubscribeMessage('addUser')
	async name(intra_id: any) {
		console.log('addUser backend: ' + intra_id.intra_id);
	}
}