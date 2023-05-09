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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const channel_service_1 = require("../channel/channel.service");
const user_service_1 = require("../user/user.service");
const message_service_1 = require("./message.service");
let MessageController = class MessageController {
    messageservice;
    userservice;
    channelservice;
    constructor(messageservice, userservice, channelservice) {
        this.messageservice = messageservice;
        this.userservice = userservice;
        this.channelservice = channelservice;
    }
    async getAllMess() {
        return await this.messageservice.getAll();
    }
    async newMessage(req, res) {
        const user = await this.userservice.findUsersById(req.body.senderId);
        const channel = await this.channelservice.findChannelById(req.body.channelId);
        const message = {
            text: req.body.text,
            sender: user,
            channel: channel,
        };
        try {
            const newMessage = await this.messageservice.createMessage(message);
            res.status(200).json(newMessage);
        }
        catch (err) {
            console.log('error in newMessage: ' + err);
            res.status(500).json(err);
        }
    }
    async getChannelMessages(req, res) {
        try {
            const channel = await this.channelservice.findChannelById(req.params.channelId);
            if (!channel)
                throw new common_1.BadRequestException;
            const channelMessages = await this.messageservice.findChannelMessages(channel);
            res.status(200).json(channelMessages);
        }
        catch (err) {
            console.log('error in  getChannelMessages: ' + err);
            res.status(500).json(err);
        }
    }
};
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getAllMess", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "newMessage", null);
__decorate([
    (0, common_1.Get)('/:channelId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getChannelMessages", null);
MessageController = __decorate([
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        user_service_1.UserService,
        channel_service_1.ChannelService])
], MessageController);
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map