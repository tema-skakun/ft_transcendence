import { Profile, VerifyCallback } from 'passport-42';
import { User } from "src/entities/user/user.entity";
import { UserService } from "src/modules/user/user.service";
import { ConfigService } from "@nestjs/config";
declare const Forty2Strategy_base: new (...args: any[]) => any;
export declare class Forty2Strategy extends Forty2Strategy_base {
    private userservice;
    private readonly configService;
    constructor(userservice: UserService, configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<User>;
}
export {};
