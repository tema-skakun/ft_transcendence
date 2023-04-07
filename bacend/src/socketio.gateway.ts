import { Body, HttpCode, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { Socket } from "dgram";
import { JWTStrategy } from "./42/login.strategy";
import { AuthService } from "./auth/auth.service";
import { AuthenticationService } from "./authentication.service";
import { User } from "./typeorm";
import { UserService } from "./user/user.service";
import * as qrcode from 'qrcode'
import { PassThrough } from "stream";

@WebSocketGateway(3001, {
	cors: {
		origin: ['http://localhost:3000'],
	}
})
export class SocketioGateway {
	constructor(
		private userservice: UserService,
		private readonly twoFactorAuthenticationService: AuthService,
		// private readonly authenticationService: AuthenticationService,
		) {}
	@SubscribeMessage('login')
	@UseGuards(JWTStrategy)
	handleLogin(@Req() req: any): WsResponse<unknown> {
		const data = req.user;
		const event = 'login';
		return { event, data };
	}

	@SubscribeMessage('userUpdate')
	@UseGuards(JWTStrategy)
	async handleUserUpdate(@Req() req: any): Promise < WsResponse<unknown> >{
		const event = 'userUpdate';
		try {
			const user = await this.userservice.findUniqueByusername(req.user.username);
			await this.userservice.updateUsernameAndPic(user.intra_id, req.passed_data.username, req.passed_data.picture_url);
		} catch (error) {
			const data = error;
			return { event, data };
		}
		const data = '';
		return { event, data};
	}

	@SubscribeMessage('generate')
	@UseGuards(JWTStrategy)
	async register(@Res() response: Response, @Req() req: any) {
		const user = await this.userservice.findUniqueByusername(req.user.username);
		const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
		const qrCodeBuffer = await qrcode.toBuffer(otpauthUrl);
		const qrCodeDataUrl = `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;
    	return { event: 'qr-code', data: qrCodeDataUrl };
	}

	@SubscribeMessage('2factivationCode')
	@UseGuards(JWTStrategy)
	async turnOnTwoFactorAuthentication(
		@Req() req: any,
		@Body() { code } : any
	  ): Promise < WsResponse<unknown> >{
		const event = '2factivationCode';
		const user = await this.userservice.findUniqueByusername(req.user.username);
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
			code, user,
		);
		if (!isCodeValid) {
			const data = 'Activation code is not valid';
			return { event, data };
		}
		await this.userservice.turnOnTwoFactorAuthentication(user.intra_id);
		const data = '';
		return { event, data };
	}

	// @SubscribeMessage('authenticate')
	// @HttpCode(200)
	// @UseGuards(JWTStrategy)
	// async authenticate(
	// 	@Req() request: any,
	// 	@Body() { twoFactorAuthenticationCode } : any
	//   ) {
	// 	const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
	// 	  twoFactorAuthenticationCode, request.user
	// 	);
	// 	if (!isCodeValid) {
	// 	  throw new UnauthorizedException('Wrong authentication code');
	// 	}
	 
	// 	const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
	 
	// 	request.res.setHeader('Set-Cookie', [accessTokenCookie]);
	 
	// 	return request.user;
	//   }
}
