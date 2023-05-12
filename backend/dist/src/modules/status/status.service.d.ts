import { Repository } from 'typeorm';
import { User } from '../../entities/user/user.entity';
export declare enum ClientStatus {
    CONNECTED = "CONNECTED",
    INGAME = "INGAME",
    OFFLINE = "OFFLINE"
}
export declare class StatusService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    getStatus(): Promise<Map<number, ClientStatus>>;
}
