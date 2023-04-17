import { Body, Controller, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelDto } from "src/entities/channels/channel.dto";
import { ChannelEntity } from "src/entities/channels/channel.entity";
import { UserEntity } from "src/entities/user/user.entity";
import { Entity, In, Repository } from "typeorm";
import { UserCRUD } from "../user/userCRUD.service";

@Controller('channel')
export class ChannelController {
	constructor(
	) {}

	@Post('/new')
	async create(@Body() newChannel: ChannelDto) {
	
	}

}