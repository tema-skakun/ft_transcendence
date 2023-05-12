import { Strategy } from "passport-jwt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/modules/user/user.service";
import { ConfigService } from "@nestjs/config";
declare const JWTStrategy_base: new (...args: any[]) => Strategy;
export declare class JWTStrategy extends JWTStrategy_base {
    private jwtservice;
    private userservice;
    private readonly configService;
    constructor(jwtservice: JwtService, userservice: UserService, configService: ConfigService);
    validate(payload: any): Promise<import("../entities").User>;
}
export {};
