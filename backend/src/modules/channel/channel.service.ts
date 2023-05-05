import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { dmChannelDto } from "src/entities/channel/dmchannel.dto";
import { Channel } from "src/entities/channel/channel.entity";
import { In, Repository } from "typeorm";
import { ChannelDto } from "src/entities/channel/channel.dto";


@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
		) {}

	async createDmChannel(dmchannelDto: dmChannelDto) {
		const newChannel = await this.channelRepository.create(dmchannelDto);
		return await this.channelRepository.save(newChannel);
	}

	async createChannel(channelDto: ChannelDto) {
		const newChannel = await this.channelRepository.create(channelDto);
		return await this.channelRepository.save(newChannel);
	}

	async getChannels() {
		return await this.channelRepository.find();
	}

	async findUserChannels(intra_id: number) {
		return await this.channelRepository.find({
			where: { users: { intra_id } },
			order: {
				updated_at: 'DESC'
			}
		});
	}

	async findChannelById(id: number) {
		return await this.channelRepository.findOneBy({
			id: id, 
		});
	}

	async findChannelUsers(id: number) {
		const channnelUsers = await this.channelRepository.findOne({ 
			where: { id },
			relations: ['users']
		});
		return channnelUsers.users;
	}
}