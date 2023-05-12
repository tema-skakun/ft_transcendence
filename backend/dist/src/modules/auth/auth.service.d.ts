import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthenticationService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    getCookieWithJwtAccessToken(intra_id: number, isSecondFactorAuthenticated?: boolean): string;
}
