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
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const channel_entity_1 = require("../../entities/channel/channel.entity");
const typeorm_2 = require("typeorm");
let ChannelService = class ChannelService {
    channelRepository;
    constructor(channelRepository) {
        this.channelRepository = channelRepository;
    }
    async createDmChannel(dmchannelDto) {
        const newChannel = await this.channelRepository.create(dmchannelDto);
        return await this.channelRepository.save(newChannel);
    }
    async createChannel(channelDto) {
        const newChannel = await this.channelRepository.create(channelDto);
        return await this.channelRepository.save(newChannel);
    }
    async getChannels() {
        return await this.channelRepository.find();
    }
    async findUserChannels(intra_id) {
        return await this.channelRepository.find({
            where: { users: { intra_id } },
            order: {
                updated_at: 'DESC'
            }
        });
    }
    async findChannelById(id) {
        return await this.channelRepository.findOneBy({
            id: id,
        });
    }
    async findChannelUsers(id) {
        const channnelUsers = await this.channelRepository.findOne({
            where: { id },
            relations: ['users']
        });
        return channnelUsers.users;
    }
    async findChannelByIdWithUsers(id) {
        const channnel = await this.channelRepository.findOne({
            where: { id },
            relations: ['users']
        });
        return channnel;
    }
    async addUserToChannel(channel, user) {
        channel.users.push(user);
        return this.channelRepository.save(channel);
    }
    async findChannelsUserCanJoin(user) {
        const channels = await this.channelRepository.find({
            relations: ['users', 'invited', 'bannedUsers']
        });
        const joinableChannels = [];
        for (const channel of channels) {
            if (channel.isPrivate) {
                const isInvited = channel.invited?.some(invitedUser => invitedUser.intra_id === user.intra_id);
                if (!isInvited) {
                    continue;
                }
            }
            const usr = channel.users?.some(channelUser => channelUser.intra_id === user.intra_id);
            if (usr) {
                continue;
            }
            const banned = channel.bannedUsers?.some(bannedUser => bannedUser.intra_id === user.intra_id);
            if (banned) {
                continue;
            }
            joinableChannels.push(channel);
        }
        return joinableChannels;
    }
    async isInvited(channelId, user) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['invited'],
        });
        return channel.invited?.some(invitedUser => invitedUser.intra_id === user.intra_id) ?? false;
    }
    async isBanned(channelId, user) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['bannedUsers'],
        });
        return channel.bannedUsers?.some(bannedUser => bannedUser.intra_id === user.intra_id) ?? false;
    }
};
ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChannelService);
exports.ChannelService = ChannelService;
//# sourceMappingURL=channel.service.js.map