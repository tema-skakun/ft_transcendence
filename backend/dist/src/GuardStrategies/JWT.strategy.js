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
exports.JWTStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_jwt_1 = require("passport-jwt");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../modules/user/user.service");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
let JWTStrategy = class JWTStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    jwtservice;
    userservice;
    configService;
    constructor(jwtservice, userservice, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
        this.jwtservice = jwtservice;
        this.userservice = userservice;
        this.configService = configService;
    }
    async validate(payload) {
        return await this.userservice.findUsersById(payload.intra_id);
    }
};
JWTStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        config_1.ConfigService])
], JWTStrategy);
exports.JWTStrategy = JWTStrategy;
//# sourceMappingURL=JWT.strategy.js.map