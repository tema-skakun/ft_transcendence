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
exports.Forty2Strategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const user_service_1 = require("../modules/user/user.service");
const config_1 = require("@nestjs/config");
let Forty2Strategy = class Forty2Strategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    userservice;
    configService;
    constructor(userservice, configService) {
        super({
            clientID: configService.get('CLIENTID'),
            clientSecret: configService.get('CLIENTSECRET'),
            callbackURL: configService.get('CALLBACKURL'),
            scope: ['public'],
        });
        this.userservice = userservice;
        this.configService = configService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const usr = await this.userservice.findUniqueByEmail(profile.emails[0].value);
        if (usr) {
            return done(null, usr);
        }
        else {
            const apiClient = axios_1.default.create({
                baseURL: 'https://api.intra.42.fr',
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            });
            const apiResponse = await apiClient.get('/v2/users/' + profile.id);
            const user = {
                intra_id: apiResponse.data.id,
                email: apiResponse.data.email,
                username: apiResponse.data.login,
                picture_url: apiResponse.data.image.versions.medium,
                first_name: apiResponse.data.first_name,
                last_name: apiResponse.data.last_name,
                accessToken,
                refreshToken,
            };
            return done(null, await this.userservice.createUser(user));
        }
    }
};
Forty2Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService])
], Forty2Strategy);
exports.Forty2Strategy = Forty2Strategy;
//# sourceMappingURL=42.strategy.js.map