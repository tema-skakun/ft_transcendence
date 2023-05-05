import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { dmChannelDto } from "src/entities/channel/dmchannel.dto";
import JwtTwoFactorGuard from "src/GuardStrategies/Jwt2F.guard";
import { UserService } from "../user/user.service";
import { ChannelService } from "./channel.service";
import { encodePassword } from "src/tools/bcrypt";


@Controller('chat')
export class ChannelController {
	constructor(private readonly channelservice: ChannelService,
		private readonly userservice: UserService,
		) {}

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
	
	@Post('createDM')
	// @UseGuards(JwtTwoFactorGuard)
	async newDmChannel(
		@Req() req: any,
		@Res() res: any) {
		try {
			const user = await this.userservice.findUsersById(req.body.senderId);
			const user1 = await this.userservice.findUsersById(req.body.receiverId);
			const savedChat = await this.channelservice.createDmChannel({
				users: [user, user1]
			});
			res.status(200).json(savedChat);
		}catch(err) {
			console.log('error: ' + err);
			res.status(500).json(err);
		}
	}
	
	@Post('createChannel')
	@UseGuards(JwtTwoFactorGuard)
	async newChannel(
		@Req() req: any,
		@Res() res: any,)
	{
		try {
			const users = [];
			users.push(req.user)
			for (const userId of req.body.usersId) {
				const user = await this.userservice.findUsersById(userId);
				if (user) {
				  users.push(user);
				}
			}
			let password = req.body.password;
			if(password.length !== 0)
      			password = encodePassword(password);
			const newChannel = {
				name: req.body.name,
				isDM: false,
				isPrivate: req.body.type === 'private' ? true : false,
				password: req.body.type === 'protected' ? password : null,
				owner: req.user,
				users: users,
				administrators: [req.user],
			}
			const Channel = await this.channelservice.createChannel(newChannel);
			res.status(200).json(Channel);
		}catch(err) {
			if (err.code === '23505')
				res.status(400).json('Channel name already exist');
			else
				res.status(400).json(err.message);
		}
	}
}
