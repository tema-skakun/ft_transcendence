import { ConfigService } from '@nestjs/config';
import { User } from '../../../entities/user/user.entity';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class TwoFactorAuthenticationService {
    private readonly usersService;
    private readonly configService;
    private readonly jwtService;
    constructor(usersService: UserService, configService: ConfigService, jwtService: JwtService);
    generateTwoFactorAuthenticationSecret(user: User): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User): boolean;
}
