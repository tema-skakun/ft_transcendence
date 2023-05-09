import { Channel } from "../channel/channel.entity";
import { User } from "../user/user.entity";
export declare class Message {
    id: number;
    text: string;
    createdAt: Date;
    sender: User;
    channel: Channel;
}
