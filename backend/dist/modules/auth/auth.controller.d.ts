import { AuthenticationService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthenticationController {
    private readonly authenticationService;
    private readonly usersService;
    private jwtService;
    private readonly configService;
    constructor(authenticationService: AuthenticationService, usersService: UserService, jwtService: JwtService, configService: ConfigService);
    forty2AuthRedirect(req: any, res: any): any;
    logIn(req: any): Promise<any>;
}
