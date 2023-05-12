import { UserService } from '../modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const JwtTwoFactorStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtTwoFactorStrategy extends JwtTwoFactorStrategy_base {
    private readonly configService;
    private readonly userService;
    constructor(configService: ConfigService, userService: UserService);
    validate(payload: any): Promise<import("../entities").User>;
}
export {};
