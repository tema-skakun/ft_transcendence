import { Channel } from "../channel/channel.entity";
import { User } from "../user/user.entity";
export declare class MessageDto {
    text: string;
    sender: User;
    channel: Channel;
}
