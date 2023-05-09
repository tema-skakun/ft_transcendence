import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { FriendDto } from './friends.controller';
import { StatusService } from '../status/status.service';
export declare class FriendsService {
    private readonly statusService;
    private userRepository;
    constructor(statusService: StatusService, userRepository: Repository<User>);
    private initalUser;
    deleteFriend(userId: number, friend_id: number): Promise<boolean>;
    addFriend(userId: number, friend_id: number): Promise<User>;
    getFriends(userId: number): Promise<User[]>;
    entityToDisplayable(user: User): Promise<FriendDto>;
}
