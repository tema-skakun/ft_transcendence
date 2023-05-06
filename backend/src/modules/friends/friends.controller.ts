import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Param } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';
import { User } from 'src/entities';

@Controller('/friends')
export class FriendsController {
	constructor(
		private readonly friendsService: FriendsService
	) {}

	@Post('/:id')
	@UseGuards(JwtTwoFactorGuard)
	async addFriend(@Param('id') id: number, @Req() req: any): Promise<User> {
		return await this.friendsService.addFriend(req.user.intra_id , id);
	}
}
