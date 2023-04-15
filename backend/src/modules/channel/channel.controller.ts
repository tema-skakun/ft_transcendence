import { Body, Controller, Post } from "@nestjs/common";
import { ChannelDto } from "src/entities/channels/channel.dto";
import { ChannelEntity } from "src/entities/channels/channel.entity";
import { UserCRUD } from "../user/userCRUD.service";

@Controller('channel')
export class ChannelController {
	constructor(
		private readonly usercRud: UserCRUD
	) {}

	@Post('/new')
	async createChannel(@Body() newChannel: ChannelDto) {
		// const newChannelEntity: ChannelEntity = new ChannelEntity;
		console.log(JSON.stringify(await this.usercRud.readAll()));
	}
}