import { Channel } from "src/entities/channel/channel.entity";
import { MessageDto } from "src/entities/message/message.dto";
import { Message } from "src/entities/message/message.entity";
import { Repository } from "typeorm";
export declare class MessageService {
    private readonly messageRepository;
    constructor(messageRepository: Repository<Message>);
    createMessage(messageDto: MessageDto): Promise<Message>;
    findChannelMessages(channel: Channel): Promise<Message[]>;
    getAll(): Promise<Message[]>;
}
