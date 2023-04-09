import { Controller, Get, UseGuards, Req, Res, Post, ValidationPipe, UsePipes, Body } from "@nestjs/common";
import { AppService } from './app.service';
import {AuthGuard} from '@nestjs/passport';
import { IsNotEmpty, IsString } from "class-validator";
import { UserDto } from "./user/dto";

class userDto {
	@IsNotEmpty()
	@IsString()
	name: string;
}

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('user')
	@UsePipes(ValidationPipe)
	testUser(@Body() user: UserDto) {
		console.log(JSON.stringify(user));
	}

	// @Get('aa')
	// @UseGuards(AuthGuard('42'))
	// async forty2Auth(@Req() req) {
	// }

	// @Get('auth/42/callback')
	// @UseGuards(AuthGuard('42'))
	// forty2AuthRedirect(@Req() req, @Res() res: any) {
	// 	// return this.appService.forty2Login(req)
	// 	this.appService.forty2Login(req, res)
	// }
}
