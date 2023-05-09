import { UserService } from "../user/user.service";
import { ChannelService } from "./channel.service";
export declare class ChannelController {
    private readonly channelservice;
    private readonly userservice;
    constructor(channelservice: ChannelService, userservice: UserService);
    getUsers(): Promise<import("../../entities/channel/channel.entity").Channel[]>;
    joinChannels2(req: any, res: any): Promise<void>;
    getUserChannels(req: any, res: any): Promise<void>;
    getChannel(req: any, res: any): Promise<void>;
    newDmChannel(req: any, res: any): Promise<void>;
    newChannel(req: any, res: any): Promise<void>;
}
