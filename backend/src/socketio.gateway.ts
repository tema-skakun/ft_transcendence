import { Req, UseGuards } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { JWTStrategy } from "./42/login.strategy";
import { User } from "./typeorm";

@WebSocketGateway(3001, {
	cors: {
		origin: ['http://localhost:3000'],
	}
})
export class SocketioGateway {
	@SubscribeMessage('login')
	@UseGuards(JWTStrategy)
	handleLogin(@Req() req: any): WsResponse<unknown> {
		// console.log('xxx');
		// console.log(req.user);
		// console.log('cccc');
		// return req.user;
		const data = req.user;
		const event = 'login';
		return { event, data };
	}
}
