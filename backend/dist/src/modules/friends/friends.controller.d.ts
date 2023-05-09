import { FriendsService } from './friends.service';
import { User } from 'src/entities';
export type FriendDto = {
    name: string;
    id: number;
    pictureUrl?: string;
    status: string;
};
export declare class FriendsController {
    private readonly friendsService;
    constructor(friendsService: FriendsService);
    deleteFriend(id: number, req: any): Promise<boolean>;
    addFriend(id: number, req: any): Promise<User>;
    getDisplayables(id: number): Promise<FriendDto[]>;
}
