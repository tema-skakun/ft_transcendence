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
exports.FriendsController = void 0;
const common_1 = require("@nestjs/common");
const friends_service_1 = require("./friends.service");
const common_2 = require("@nestjs/common");
const Jwt2F_guard_1 = require("../../GuardStrategies/Jwt2F.guard");
let FriendsController = class FriendsController {
    friendsService;
    constructor(friendsService) {
        this.friendsService = friendsService;
    }
    async deleteFriend(id, req) {
        return await this.friendsService.deleteFriend(req.user.intra_id, id);
    }
    async addFriend(id, req) {
        return await this.friendsService.addFriend(req.user.intra_id, id);
    }
    async getDisplayables(id) {
        const friendsEntity = await this.friendsService.getFriends(id);
        const friendsDto = await Promise.all(friendsEntity.map(async (friend) => {
            return await this.friendsService.entityToDisplayable(friend);
        }));
        return (friendsDto);
    }
    async getDisplayablesAll(req) {
        const friendsEntity = await this.friendsService.getFriends(req.user.intra_id);
        console.log("friends dto: " + friendsEntity[0]);
        const friendsDto = await Promise.all(friendsEntity.map(async (friend) => {
            return await this.friendsService.entityToDisplayable(friend);
        }));
        console.log("friends dto: " + friendsDto[0]);
        return (friendsDto);
    }
};
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "deleteFriend", null);
__decorate([
    (0, common_1.Post)('/:id'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Get)('/displayable/:id'),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getDisplayables", null);
__decorate([
    (0, common_1.Get)('/displayable'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getDisplayablesAll", null);
FriendsController = __decorate([
    (0, common_1.Controller)('/friends'),
    __metadata("design:paramtypes", [friends_service_1.FriendsService])
], FriendsController);
exports.FriendsController = FriendsController;
//# sourceMappingURL=friends.controller.js.map