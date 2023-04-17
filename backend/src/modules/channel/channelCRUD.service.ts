import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelDto } from "src/entities/channels/channel.dto";
import { ChannelEntity } from "src/entities/channels/channel.entity";
import { UserEntity } from "src/entities/user/user.entity";
import { FindManyOptions, Repository, In } from "typeorm";
import { UserCRUD } from "../user/userCRUD.service";

@Injectable()
export class ChannelCRUD {
	constructor(
		@InjectRepository(ChannelEntity)
		private rep: Repository<ChannelEntity>,
		// private userCRUD: UserCRUD
	) {}

	async create(channel: ChannelDto) {
		// const newChannelEntity: ChannelEntity = new ChannelEntity;

		// const channelMembers: UserEntity [] = await this.userCRUD.query( {
		// 	where: {
		// 		id: In(channel.users)
		// 	},
		// 	relations: ['channels']
		// } ); // Find all the users whose id match
		// channel.users = [];
		// for (const channelMember of channelMembers) {
		// 	newChannelEntity.users.push(channelMember);
		// 	channelMember.channels.push(newChannelEntity);
		// }
		// this.rep.save(newChannelEntity);
	}

	async find(opts: FindManyOptions<ChannelEntity>): Promise<ChannelEntity> {
		return await this.rep.findOne(opts);
	}

	async findAll(opts: FindManyOptions<ChannelEntity>): Promise<ChannelEntity []> {
		return await this.rep.find(opts);
	}

}
