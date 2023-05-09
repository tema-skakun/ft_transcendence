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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../entities");
const typeorm_2 = require("typeorm");
const status_service_1 = require("../status/status.service");
const status_service_2 = require("../status/status.service");
let FriendsService = class FriendsService {
    statusService;
    userRepository;
    constructor(statusService, userRepository) {
        this.statusService = statusService;
        this.userRepository = userRepository;
    }
    async initalUser(userId) {
        const initalUser = await this.userRepository.findOne({
            where: {
                intra_id: userId
            },
            relations: ['friends']
        });
        return (initalUser);
    }
    async deleteFriend(userId, friend_id) {
        const userWithFriend = await this.initalUser(userId);
        let success = false;
        userWithFriend.friends = userWithFriend.friends.map((friend) => {
            if (friend.intra_id = friend_id) {
                success = true;
                return;
            }
            return friend;
        });
        await this.userRepository.save(userWithFriend);
        return success;
    }
    async addFriend(userId, friend_id) {
        const userWithoutFriend = await this.initalUser(userId);
        const friend = await this.userRepository.findOneBy({
            intra_id: friend_id
        });
        userWithoutFriend.friends.push(friend);
        return this.userRepository.save(userWithoutFriend);
    }
    async getFriends(userId) {
        const user = await this.userRepository.findOne({
            where: {
                intra_id: userId
            },
            relations: ['friends']
        });
        return (user.friends);
    }
    async entityToDisplayable(user) {
        const userStatus = await this.statusService.getStatus();
        let friendStatus = 'No status set';
        if (userStatus.get(user.intra_id) === status_service_2.ClientStatus.OFFLINE)
            friendStatus = 'Offline';
        else if (userStatus.get(user.intra_id) === status_service_2.ClientStatus.CONNECTED)
            friendStatus = 'Connected';
        else if (userStatus.get(user.intra_id) === status_service_2.ClientStatus.INGAME)
            friendStatus = 'In game';
        return {
            name: user.username,
            id: user.intra_id,
            pictureUrl: user.picture_url,
            status: friendStatus
        };
    }
};
FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [status_service_1.StatusService,
        typeorm_2.Repository])
], FriendsService);
exports.FriendsService = FriendsService;
//# sourceMappingURL=friends.service.js.map