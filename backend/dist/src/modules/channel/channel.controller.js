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
exports.ChannelController = void 0;
const common_1 = require("@nestjs/common");
const Jwt2F_guard_1 = require("../../GuardStrategies/Jwt2F.guard");
const user_service_1 = require("../user/user.service");
const channel_service_1 = require("./channel.service");
const bcrypt_1 = require("../../tools/bcrypt");
let ChannelController = class ChannelController {
    channelservice;
    userservice;
    constructor(channelservice, userservice) {
        this.channelservice = channelservice;
        this.userservice = userservice;
    }
    getUsers() {
        return this.channelservice.getChannels();
    }
    async joinChannels2(req, res) {
        console.log('hello from join channel');
        try {
            console.log('heljo from join');
            const channels = await this.channelservice.findChannelsUserCanJoin(req.user);
            console.log('channells: ' + channels.length);
            res.status(200).json(channels);
        }
        catch (err) {
            console.log('heljo from join eeerrrr');
            res.status(400).json(err.message);
        }
    }
    async getUserChannels(req, res) {
        try {
            const userChannels = await this.channelservice.findUserChannels(req.params.intra_id);
            res.status(200).json(userChannels);
        }
        catch (err) {
            console.log('error: ' + err);
            res.status(500).json(err);
        }
    }
    async getChannel(req, res) {
        try {
            const userChannels = await this.channelservice.findChannelUsers(req.params.channel_id);
            res.status(200).json(userChannels);
        }
        catch (err) {
            console.log('error: ' + err);
            res.status(500).json(err);
        }
    }
    async newDmChannel(req, res) {
        try {
            const user = await this.userservice.findUsersById(req.body.senderId);
            const user1 = await this.userservice.findUsersById(req.body.receiverId);
            const savedChat = await this.channelservice.createDmChannel({
                users: [user, user1]
            });
            res.status(200).json(savedChat);
        }
        catch (err) {
            console.log('error: ' + err);
            res.status(500).json(err);
        }
    }
    async newChannel(req, res) {
        try {
            const users = [];
            users.push(req.user);
            for (const userId of req.body.usersId) {
                const user = await this.userservice.findUsersById(userId);
                if (user) {
                    users.push(user);
                }
            }
            if (req.body.name.length === 0 || (req.body.type !== 'private' && req.body.type !== 'public' && req.body.type !== 'protected'))
                throw new common_1.ForbiddenException('you did something wrong');
            let password = req.body.password;
            if (password.length !== 0)
                password = (0, bcrypt_1.encodePassword)(password);
            const newChannel = {
                name: req.body.name,
                isDM: false,
                isPrivate: req.body.type === 'private' ? true : false,
                password: req.body.type === 'protected' ? password : null,
                owner: req.user,
                users: users,
                administrators: [req.user],
            };
            const Channel = await this.channelservice.createChannel(newChannel);
            res.status(200).json(Channel);
        }
        catch (err) {
            if (err.code === '23505')
                res.status(400).json('Channel name already exist');
            else
                res.status(400).json(err.message);
        }
    }
};
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('joinchannels'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "joinChannels2", null);
__decorate([
    (0, common_1.Get)('/:intra_id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getUserChannels", null);
__decorate([
    (0, common_1.Get)('channelUsers/:channel_id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannel", null);
__decorate([
    (0, common_1.Post)('createDM'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "newDmChannel", null);
__decorate([
    (0, common_1.Post)('createChannel'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "newChannel", null);
ChannelController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService,
        user_service_1.UserService])
], ChannelController);
exports.ChannelController = ChannelController;
//# sourceMappingURL=channel.controller.js.map