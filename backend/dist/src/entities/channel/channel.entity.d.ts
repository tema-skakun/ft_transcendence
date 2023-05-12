import { User } from "../user/user.entity";
export declare class Channel {
    id: number;
    name?: string;
    isPrivate: boolean;
    isDM: boolean;
    password?: string;
    owner?: User;
    users: User[];
    administrators?: User[];
    invited?: User[];
    bannedUsers?: User[];
    updated_at: Date;
}
