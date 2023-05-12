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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../user/user.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const Jwt2F_guard_1 = require("../../GuardStrategies/Jwt2F.guard");
const config_1 = require("@nestjs/config");
let AuthenticationController = class AuthenticationController {
    authenticationService;
    usersService;
    jwtService;
    configService;
    constructor(authenticationService, usersService, jwtService, configService) {
        this.authenticationService = authenticationService;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    forty2AuthRedirect(req, res) {
        if (!req.user) {
            return 'No user from 42';
        }
        const payload = { email: req.user.email, intra_id: req.user.intra_id, token: req.user.accessToken };
        const token = this.jwtService.sign(payload, { secret: this.configService.get('JWT_SECRET_KEY') });
        res.cookie('accessToken', token);
        if (!this.configService.get('FRONTEND_URL')) {
            throw new Error('FRONTEND_URL is not set in .env file');
        }
        return res.redirect(this.configService.get('FRONTEND_URL'));
    }
    async logIn(req) {
        const { user } = req;
        if (!user) {
            return req.res.status(401).json({ message: 'Authentication failed' });
        }
        return user;
    }
};
__decorate([
    (0, common_1.Get)('intra'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "forty2AuthRedirect", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    (0, common_1.Get)('log-in'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logIn", null);
AuthenticationController = __decorate([
    (0, common_1.Controller)('authentication'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [auth_service_1.AuthenticationService,
        user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=auth.controller.js.map