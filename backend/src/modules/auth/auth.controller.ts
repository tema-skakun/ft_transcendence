import {
	Req,
	Controller,
	HttpCode,
	UseGuards,
	ClassSerializerInterceptor,
	UseInterceptors,
	Res,
	Get,
} from '@nestjs/common';
import { AuthenticationService} from './auth.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';
import { ConfigService } from '@nestjs/config';
   
  @Controller('authentication')
  @UseInterceptors(ClassSerializerInterceptor)
  export class AuthenticationController {
	constructor(
	  private readonly authenticationService: AuthenticationService,
	  private readonly usersService: UserService,
	  private jwtService: JwtService,
	  private readonly configService: ConfigService,
	) {}

	@Get('intra')
	@UseGuards(AuthGuard('42'))
	forty2AuthRedirect(@Req() req: any, @Res() res: any) {
		if(!req.user) {
			return 'No user from 42'
		}
		const payload = { email: req.user.email, id: req.user.intra_id, token: req.user.accessToken};
		const token = this.jwtService.sign(payload, {secret: this.configService.get('JWT_SECRET_KEY')});
		const payload1 = { email: '123@123.lv', id: 123, token: '123'};
		// const token1 = this.jwtService.sign(payload1, {secret: this.configService.get('JWT_SECRET_KEY')});
		// console.log('Token: ' + token1);
		// res.cookie('accessToken', token);
		return res.redirect('http://localhost:3000');
	}
	
	@HttpCode(200)
	@UseGuards(JwtTwoFactorGuard)
	@Get('log-in')
	async logIn(@Req() req: any) {
		const { user } = req;
		if (!user) {
			return req.res.status(401).json({ message: 'Authentication failed' });
		}
		return user;
	}
   
  }