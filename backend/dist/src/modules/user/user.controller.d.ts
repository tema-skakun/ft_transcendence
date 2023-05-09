import { UserDto } from '../../entities/user/user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userservice;
    constructor(userservice: UserService);
    getUsers(req: any, res: any): Promise<void>;
    updateUser(req: any, { username, profilePic }: any): Promise<void>;
    createUser(dto: UserDto): Promise<import("../../entities").User>;
    deleteusr(id: any): void;
}
