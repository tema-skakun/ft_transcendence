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
exports.Channel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
let Channel = class Channel {
    id;
    name;
    isPrivate;
    isDM;
    password;
    owner;
    users;
    administrators;
    invited;
    updated_at;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Channel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Channel.prototype, "isPrivate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Channel.prototype, "isDM", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Channel.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.ownedChannels),
    __metadata("design:type", user_entity_1.User)
], Channel.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, user => user.channels),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Channel.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, user => user.administeredChannels),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Channel.prototype, "administrators", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", Array)
], Channel.prototype, "invited", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Channel.prototype, "updated_at", void 0);
Channel = __decorate([
    (0, typeorm_1.Entity)()
], Channel);
exports.Channel = Channel;
//# sourceMappingURL=channel.entity.js.map