import { Controller, Req, UseGuards } from '@nestjs/common';
import { ClientStatus, StatusService } from './status.service';
import { Get } from '@nestjs/common';
import JwtTwoFactorGuard from '../../GuardStrategies/Jwt2F.guard'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Controller('status')
export class StatusController {
	constructor(private statusService: StatusService,
		@InjectRepository(User) private userRep: Repository<User>) {}

	@Get('/')
	@UseGuards(JwtTwoFactorGuard)
	async getStatus(@Req() req: any): Promise< Map<number, ClientStatus> > {
		if (req.user) {
			console.log('cookie is set, even if no guard used');
		}
		const requesterEntity: User = await this.userRep.findOne({
			where: {
				intra_id: 106769
			},
			relations: ['friends']
		})
		const friends: Set<number> = new Set(requesterEntity.friends.map(friend => friend.intra_id));
		console.log(`These are my friends: ${JSON.stringify(friends)}`);

		const filteredStatusMap: Map<number, ClientStatus> = new Map();
		const statusMap: Map<number, ClientStatus> =  await this.statusService.getStatus();

		statusMap.forEach((stat, id) => {
			if (friends.has(id))
				filteredStatusMap.set(id, stat);
		})

		return filteredStatusMap;
	}
}
