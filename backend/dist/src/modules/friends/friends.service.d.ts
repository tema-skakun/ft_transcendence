import { User } from 'src/entities';
import { Repository } from 'typeorm';
export declare class FriendsService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    addFriend(userId: number, friend_id: number): Promise<User>;
}
