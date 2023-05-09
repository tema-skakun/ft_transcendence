import { User } from "../user/user.entity";
export declare class ChannelDto {
    name: string;
    isPrivate?: boolean;
    isDM: boolean;
    password?: string;
    owner: User;
    users: User[];
    administrators: User[];
}
