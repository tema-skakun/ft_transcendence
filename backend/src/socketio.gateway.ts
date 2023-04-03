import { Body, HttpCode, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { Socket } from "dgram";
import { JWTStrategy } from "./42/login.strategy";
import { AuthService } from "./auth/auth.service";
import { AuthenticationService } from "./authentication.service";
import { User } from "./typeorm";
import { UserService } from "./user/user.service";

@WebSocketGateway(3001, {
	cors: {
		origin: ['http://localhost:3000'],
	}
})
export class SocketioGateway {
	constructor(
		private userservice: UserService,
		private readonly twoFactorAuthenticationService: AuthService,
		private readonly authenticationService: AuthenticationService,
		) {}
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

	@SubscribeMessage('userUpdate')
	@UseGuards(JWTStrategy)
	async handleUserUpdate(@Req() req: any): Promise < WsResponse<unknown> >{
		const event = 'userUpdate';
		try {
			await this.userservice.updateUsernameAndPic(req.user.intra_id, req.passed_data.username, req.passed_data.picture_url);
		} catch (error) {
			const data = error;
			return { event, data };
		}
		const data = '';
		return { event, data};
	}

	@SubscribeMessage('generate')
	@UseGuards(JWTStrategy)
	async register(@Res() response: Response, @Req() request: any) {
		const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
	 
		return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
	}

	@SubscribeMessage('turn-on')
	@HttpCode(200)
	@UseGuards(JWTStrategy)
	async turnOnTwoFactorAuthentication(
		@Req() request: any,
		@Body() { twoFactorAuthenticationCode } : any
	  ) {
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		  twoFactorAuthenticationCode, request.user
		);
		if (!isCodeValid) {
		  throw new UnauthorizedException('Wrong authentication code');
		}
		await this.userservice.turnOnTwoFactorAuthentication(request.user.id);
	}

	@SubscribeMessage('authenticate')
	@HttpCode(200)
	@UseGuards(JWTStrategy)
	async authenticate(
		@Req() request: any,
		@Body() { twoFactorAuthenticationCode } : any
	  ) {
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		  twoFactorAuthenticationCode, request.user
		);
		if (!isCodeValid) {
		  throw new UnauthorizedException('Wrong authentication code');
		}
	 
		const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
	 
		request.res.setHeader('Set-Cookie', [accessTokenCookie]);
	 
		return request.user;
	  }
}
