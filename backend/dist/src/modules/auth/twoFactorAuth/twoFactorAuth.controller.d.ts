import { TwoFactorAuthenticationService } from './twoFactorAuth.service';
import { Response } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { AuthenticationService } from '../auth.service';
export declare class twoFactorAuthController {
    private readonly twoFactorAuthenticationService;
    private readonly userService;
    private readonly authenticationService;
    constructor(twoFactorAuthenticationService: TwoFactorAuthenticationService, userService: UserService, authenticationService: AuthenticationService);
    turnOnTwoFactorAuthentication(request: any, { twoFactorAuthenticationCode }: any): Promise<void>;
    register(res: Response, req: any): Promise<void>;
    authenticate(request: any, { twoFactorAuthenticationCode }: any): Promise<string>;
}
