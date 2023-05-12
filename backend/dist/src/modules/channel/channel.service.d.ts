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
    findChannelByIdWithUsers(id: number): Promise<Channel>;
    addUserToChannel(channel: Channel, user: User): Promise<Channel>;
    findChannelsUserCanJoin(user: User): Promise<Channel[]>;
    isInvited(channelId: number, user: User): Promise<boolean>;
    isBanned(channelId: number, user: User): Promise<boolean>;
    isDMChannel(user1: User, user2: User): Promise<Channel>;
    leaveChannel(intra_id: number, channelId: number): Promise<void>;
}
