import { UserDto } from '../../entities/user/user.dto';
import { User } from "../../entities/user/user.entity";
import { Repository } from "typeorm";
export declare class UserService {
    private readonly typeormRepository;
    constructor(typeormRepository: Repository<User>);
    createUser(authDto: UserDto): Promise<User>;
    getUsers(): Promise<User[]>;
    findUniqueByEmail(email: string): Promise<User>;
    findUniqueByusername(username: string): Promise<User>;
    findUsersById(id: number): Promise<User>;
    findUserByIdAndGetRelated(id: number, nameOfRelated: string[]): Promise<User>;
    updateUsernameAndPic(userid: number, newUsername: string, newPicUrl: string): Promise<void>;
    deleteuser(id: number): Promise<void>;
    validateUser(user: any): Promise<User>;
    setTwoFactorAuthenticationSecret(secret: string, userid: number): Promise<import("typeorm").UpdateResult>;
    turnOnTwoFactorAuthentication(intra_id: number): Promise<import("typeorm").UpdateResult>;
    incr_totalWins(usrEntity: User): Promise<import("typeorm").UpdateResult>;
    incr_totalLosses(usrEntity: User): Promise<import("typeorm").UpdateResult>;
    getWinsToLossesRatio(intra_id: number): Promise<number | string>;
    getWinsToLossesArray(): Promise<number[]>;
}
