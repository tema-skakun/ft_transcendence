import { User } from "src/entities";
import { dmChannelDto } from "src/entities/channel/dmchannel.dto";
import { Channel } from "src/entities/channel/channel.entity";
import { Repository } from "typeorm";
import { ChannelDto } from "src/entities/channel/channel.dto";
export declare class ChannelService {
    private readonly channelRepository;
    constructor(channelRepository: Repository<Channel>);
    createDmChannel(dmchannelDto: dmChannelDto): Promise<Channel>;
    createChannel(channelDto: ChannelDto): Promise<Channel>;
    getChannels(): Promise<Channel[]>;
    findUserChannels(intra_id: number): Promise<Channel[]>;
    findChannelById(id: number): Promise<Channel>;
    findChannelUsers(id: number): Promise<User[]>;
    findChannelsUserCanJoin(user: User): Promise<Channel[]>;
}
