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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entities/user/user.entity");
const typeorm_2 = require("typeorm");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    createUser(authDto) {
        const newUser = this.userRepository.create(authDto);
        return this.userRepository.save(newUser);
    }
    async getnotBannedUsers(intra_id) {
        const allUsers = await this.userRepository.find();
        const user1 = await this.userRepository.findOne({
            where: {
                intra_id: intra_id
            },
            relations: ['blockedUsers'],
        });
        const notBannedUsers = [];
        for (const user of allUsers) {
            const usr = user1.blockedUsers?.some(blockeduser => blockeduser.intra_id === user.intra_id);
            if (usr) {
                continue;
            }
            notBannedUsers.push(user);
        }
        return notBannedUsers;
    }
    async isBlocked(intra_id, userIdToCheck) {
        const user = await this.userRepository.findOne({
            where: {
                intra_id: intra_id
            },
            relations: ['blockedBy'],
        });
        if (!user) {
            throw new Error('user doesnt exist');
        }
        const blockingUser = await this.userRepository.findOne({
            where: {
                intra_id: userIdToCheck
            },
            relations: ['blockedBy']
        });
        if (!blockingUser) {
            throw new Error('Blocking user not found');
        }
        return user.blockedBy.some((blockedUser) => blockedUser.intra_id === userIdToCheck) ||
            blockingUser.blockedBy.some((blockedUser) => blockedUser.intra_id === intra_id);
    }
    getUsers() {
        return this.userRepository.find();
    }
    findUniqueByEmail(email) {
        return this.userRepository.findOneBy({
            email: email,
        });
    }
    findUniqueByusername(username) {
        return this.userRepository.findOneBy({
            username: username,
        });
    }
    findUsersById(id) {
        return this.userRepository.findOneBy({
            intra_id: id,
        });
    }
    findUserByIdAndGetRelated(id, nameOfRelated) {
        return this.userRepository.findOne({
            where: {
                intra_id: id
            },
            relations: nameOfRelated
        });
    }
    async updateUsernameAndPic(userid, newUsername, newPicUrl) {
        await this.userRepository.update({
            intra_id: userid,
        }, {
            picture_url: newPicUrl,
        });
        try {
            await this.userRepository.update({
                intra_id: userid,
            }, {
                username: newUsername,
            });
        }
        catch {
            throw new common_1.ForbiddenException('Username already exists');
        }
    }
    async deleteuser(id) {
        this.userRepository.delete({
            intra_id: id,
        });
    }
    async validateUser(user) {
        const usr = await this.userRepository.findOneBy({
            email: user.email,
            intra_id: user.id,
            accessToken: user.token,
        });
        return usr;
    }
    async setTwoFactorAuthenticationSecret(secret, userid) {
        return await this.userRepository.update({
            intra_id: userid,
        }, {
            twoFactorAuthenticationSecret: secret,
        });
    }
    async turnOnTwoFactorAuthentication(intra_id) {
        return this.userRepository.update(intra_id, {
            isTwoFactorAuthenticationEnabled: true
        });
    }
    incr_totalWins(usrEntity) {
        if (!usrEntity.total_wins)
            usrEntity.total_wins = 0;
        ++usrEntity.total_wins;
        return this.userRepository.update(usrEntity.intra_id, {
            total_wins: usrEntity.total_wins
        });
    }
    incr_totalLosses(usrEntity) {
        if (!usrEntity.total_losses)
            usrEntity.total_losses = 0;
        ++usrEntity.total_losses;
        return this.userRepository.update(usrEntity.intra_id, {
            total_losses: usrEntity.total_losses
        });
    }
    async getWinsToLossesRatio(intra_id) {
        const usr = await this.userRepository.findOneBy({
            intra_id: intra_id
        });
        if (usr.total_losses === 0)
            return "not ranked yet";
        return usr.total_wins / usr.total_losses;
    }
    async getWinsToLossesArray() {
        const usr = await this.userRepository.find();
        console.log(`length of usr arr: ${usr.length}`);
        const ratio_arr = [];
        for (const usrEntity of usr) {
            console.log(`total losses:  ${usrEntity.total_losses}`);
            console.log(`total wins:  ${usrEntity.total_wins}`);
            if (usrEntity.total_losses === 0)
                continue;
            else
                ratio_arr.push(usrEntity.total_wins / usrEntity.total_losses);
        }
        ratio_arr.sort();
        return ratio_arr;
    }
    async findUserChannels(intra_id) {
        const user = await this.userRepository.findOne({
            where: { intra_id },
            relations: ['channels']
        });
        return user.channels;
    }
    async blockUser(intra_id, receiverId) {
        const user = await this.userRepository.findOne({
            where: {
                intra_id: intra_id,
            },
            relations: ['blockedBy'],
        });
        const blocker = await this.userRepository.findOne({
            where: {
                intra_id: receiverId,
            },
            relations: ['blockedBy'],
        });
        if (!user || !blocker) {
            throw new Error('User or blocker not found');
        }
        const blocked = await this.isBlocked(user.intra_id, blocker.intra_id);
        if (blocked) {
            throw new Error('User already blocked');
        }
        user.blockedBy = user.blockedBy || [];
        user.blockedBy.push(blocker);
        await this.userRepository.save(user);
    }
    async unblockUser(intra_id, receiverId) {
        const user = await this.userRepository.findOne({
            where: {
                intra_id: intra_id,
            },
            relations: ['blockedBy'],
        });
        const blocker = await this.userRepository.findOne({
            where: {
                intra_id: receiverId,
            },
            relations: ['blockedBy'],
        });
        if (!user || !blocker) {
            throw new Error('User or unblocker not found');
        }
        const blocked = await this.isBlocked(user.intra_id, blocker.intra_id);
        if (!blocked) {
            throw new Error('User not blocked');
        }
        user.blockedBy = user.blockedBy || [];
        user.blockedBy = user.blockedBy.filter((u) => u.intra_id !== blocker.intra_id);
        await this.userRepository.save(user);
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map