import { FriendsService } from './friends.service';
import { User } from 'src/entities';
export declare class FriendsController {
    private readonly friendsService;
    constructor(friendsService: FriendsService);
    addFriend(id: number, req: any): Promise<User>;
}
