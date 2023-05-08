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
exports.twoFactorAuthController = void 0;
const common_1 = require("@nestjs/common");
const twoFactorAuth_service_1 = require("./twoFactorAuth.service");
const user_service_1 = require("../../user/user.service");
const auth_service_1 = require("../auth.service");
const jwt_guard_1 = require("../../../GuardStrategies/jwt.guard");
const qrcode = require("qrcode");
let twoFactorAuthController = class twoFactorAuthController {
    twoFactorAuthenticationService;
    userService;
    authenticationService;
    constructor(twoFactorAuthenticationService, userService, authenticationService) {
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
        this.userService = userService;
        this.authenticationService = authenticationService;
    }
    async turnOnTwoFactorAuthentication(request, { twoFactorAuthenticationCode }) {
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, request.user);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        await this.userService.turnOnTwoFactorAuthentication(request.user.intra_id);
    }
    async register(res, req) {
        const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user);
        const qrCode = await qrcode.toBuffer(otpauthUrl);
        res.setHeader('Content-Type', 'image/png');
        res.send(qrCode);
    }
    async authenticate(request, { twoFactorAuthenticationCode }) {
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, request.user);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        const accessToken = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
        return accessToken;
    }
};
__decorate([
    (0, common_1.Post)('turn-on'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(jwt_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], twoFactorAuthController.prototype, "turnOnTwoFactorAuthentication", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.UseGuards)(jwt_guard_1.default),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], twoFactorAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('authenticate'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(jwt_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], twoFactorAuthController.prototype, "authenticate", null);
twoFactorAuthController = __decorate([
    (0, common_1.Controller)('2fa'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [twoFactorAuth_service_1.TwoFactorAuthenticationService,
        user_service_1.UserService,
        auth_service_1.AuthenticationService])
], twoFactorAuthController);
exports.twoFactorAuthController = twoFactorAuthController;
//# sourceMappingURL=twoFactorAuth.controller.js.map