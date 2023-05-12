import { UserService } from "../user/user.service";
import { ChannelService } from "./channel.service";
export declare class ChannelController {
    private readonly channelservice;
    private readonly userservice;
    constructor(channelservice: ChannelService, userservice: UserService);
    getUsers(): Promise<import("../../entities/channel/channel.entity").Channel[]>;
    getChannel(req: any, res: any): Promise<void>;
    channelsCanJoin(req: any, res: any): Promise<void>;
    getUserChannels(req: any, res: any): Promise<void>;
    newDmChannel(req: any, res: any): Promise<void>;
    joinChannel(req: any, res: any): Promise<void>;
}
