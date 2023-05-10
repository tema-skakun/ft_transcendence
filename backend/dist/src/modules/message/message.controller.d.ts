import { ChannelService } from "../channel/channel.service";
import { UserService } from "../user/user.service";
import { MessageService } from "./message.service";
export declare class MessageController {
    private readonly messageservice;
    private readonly userservice;
    private readonly channelservice;
    constructor(messageservice: MessageService, userservice: UserService, channelservice: ChannelService);
    getAllMess(): Promise<import("../../entities/message/message.entity").Message[]>;
    getChannelMessages(req: any, res: any): Promise<void>;
}
