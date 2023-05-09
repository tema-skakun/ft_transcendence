"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTwoFactorStrategy = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../modules/user/user.service");
const config_1 = require("@nestjs/config");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
let JwtTwoFactorStrategy = class JwtTwoFactorStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-two-factor') {
    configService;
    userService;
    constructor(configService, userService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY')
        });
        this.configService = configService;
        this.userService = userService;
    }
    async validate(payload) {
        const user = await this.userService.findUsersById(payload.intra_id);
        if (!user)
            return;
        if (!user.isTwoFactorAuthenticationEnabled) {
            return user;
        }
        if (payload.isSecondFactorAuthenticated) {
            return user;
        }
    }
};
JwtTwoFactorStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_service_1.UserService])
], JwtTwoFactorStrategy);
exports.JwtTwoFactorStrategy = JwtTwoFactorStrategy;
//# sourceMappingURL=Jwt2F.strategy.js.map