import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ChannelDto } from "src/entities/channel/channel.dto";
import JwtTwoFactorGuard from "src/GuardStrategies/Jwt2F.guard";
import { UserService } from "../user/user.service";
import { ChannelService } from "./channel.service";


@Controller('chat')
export class ChannelController {
	constructor(private readonly channelservice: ChannelService,
		private readonly userservice: UserService) {
	}

	@Get('all')
	getUsers() {
		return this.channelservice.getChannels();
	}

	@Get('/:intra_id')
	// @UseGuards(JwtTwoFactorGuard)
	async getUserChannels(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			const userChannels = await this.channelservice.findUserChannels(req.params.intra_id);
			res.status(200).json(userChannels);
		}catch(err) {
			console.log('error: ' + err);
			res.status(500).json(err);
		}
	}

	@Get('channelUsers/:channel_id')
	// @UseGuards(JwtTwoFactorGuard)
	async getChannel(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			const userChannels = await this.channelservice.findChannelUsers(req.params.channel_id);
			res.status(200).json(userChannels);
		}catch(err) {
			console.log('error: ' + err);
			res.status(500).json(err);
		}
	}
	
	@Post('create')
	// @UseGuards(JwtTwoFactorGuard)
	async newChannel(
		@Req() req: any,
		@Res() res: any) {
		try {
			const user = await this.userservice.findUsersById(req.body.senderId);
			const user1 = await this.userservice.findUsersById(req.body.receiverId);
			const savedChat = await this.channelservice.createChannel({
				users: [user, user1]
			});
			res.status(200).json(savedChat);
		}catch(err) {
			console.log('error: ' + err);
			res.status(500).json(err);
		}
	}
}
