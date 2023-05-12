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
    async channelsCanJoin(req, res) {
        try {
            const channels = await this.channelservice.findChannelsUserCanJoin(req.user);
            res.status(200).json(channels);
        }
        catch (err) {
            res.status(400).json(err.message);
        }
    }
    async getUserChannels(req, res) {
        try {
            if (req.params.intra_id !== req.user.intra_id)
                throw new common_1.ForbiddenException('you did something wrong');
            const userChannels = await this.channelservice.findUserChannels(req.params.intra_id);
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
    async joinChannel(req, res) {
        try {
            const channel = await this.channelservice.findChannelById(req.body.channelId);
            if (!channel)
                throw new common_1.ForbiddenException('No such channel');
            if (!req.body.password || !(0, bcrypt_1.comparePassword)(req.body.password, channel.password))
                throw new common_1.ForbiddenException('Wrong password');
            if (channel.isPrivate && !this.channelservice.isInvited(channel.id, req.user)) {
                throw new common_1.ForbiddenException('You are not invited');
            }
            res.status(200).json();
        }
        catch (err) {
            res.status(500).json(err);
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
    (0, common_1.Get)('channelUsers/:channel_id'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannel", null);
__decorate([
    (0, common_1.Get)('channelsCanJoin'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "channelsCanJoin", null);
__decorate([
    (0, common_1.Get)('/:intra_id'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getUserChannels", null);
__decorate([
    (0, common_1.Post)('createDM'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "newDmChannel", null);
__decorate([
    (0, common_1.Post)('joinChannel'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "joinChannel", null);
ChannelController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService,
        user_service_1.UserService])
], ChannelController);
exports.ChannelController = ChannelController;
//# sourceMappingURL=channel.controller.js.map