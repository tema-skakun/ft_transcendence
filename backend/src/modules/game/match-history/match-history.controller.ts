import { Controller, Get, HttpException, HttpStatus, Param, Res, Response } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';

@Controller('match-history')
export class MatchHistoryController {

	constructor(
		private matchHistoryService: MatchHistoryService
	) {}

	@Get('test')
	giveTest() {
		return 'hhhhheeey';
	}

	@Get(':id')
	async completeMatchHistory(@Param('id') intraId: number) {
		try {
			const matchHistory = await this.matchHistoryService.get(intraId);
			return matchHistory;
		} catch (err: any) {
			throw  new HttpException('internal Server errrrrror', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}