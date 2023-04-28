import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/entities/channel/channel.entity";
import { MessageDto } from "src/entities/message/message.dto";
import { Message } from "src/entities/message/message.entity";
import { Repository } from "typeorm";


@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message) private readonly messageRepository: Repository<Message>,
		) {}

	async createMessage(messageDto: MessageDto) {
		const newMessage = await this.messageRepository.create(messageDto);
		return await this.messageRepository.save(newMessage);
	}

	async findChannelMessages(channel: Channel) {
		return await this.messageRepository.find({
			where: {
				channel: channel
			},
			relations: ['sender'],
			order: {
				createdAt: 'ASC'
			}
		})
	}
}
