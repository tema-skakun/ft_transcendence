import { Controller, Get, UseGuards, Req, Res, Post } from "@nestjs/common";
import { AppService } from './app.service';
import {AuthGuard} from '@nestjs/passport';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('aa')
	@UseGuards(AuthGuard('42'))
	async forty2Auth(@Req() req) {
	}

	@Get('auth/42/callback')
	@UseGuards(AuthGuard('42'))
	forty2AuthRedirect(@Req() req, @Res() res: any) {
		// return this.appService.forty2Login(req)
		this.appService.forty2Login(req, res)
	}
}
