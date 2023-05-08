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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const archivments_entity_1 = require("../archivements/archivments.entity");
const matchHistoryEntry_entity_1 = require("../matchHistoryEntry/matchHistoryEntry.entity");
let User = User_1 = class User {
    intra_id;
    created_at;
    updated_at;
    username;
    email;
    first_name;
    last_name;
    picture_url;
    accessToken;
    refreshToken;
    twoFactorAuthenticationSecret;
    isTwoFactorAuthenticationEnabled;
    wonGames;
    lostGames;
    total_wins;
    total_losses;
    archivements;
    friends;
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
    }),
    __metadata("design:type", Number)
], User.prototype, "intra_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        default: '',
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'email',
        nullable: false,
        default: '',
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "picture_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "accessToken", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "twoFactorAuthenticationSecret", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isTwoFactorAuthenticationEnabled", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => matchHistoryEntry_entity_1.MatchHistoryEntry, (entry) => entry.winner),
    __metadata("design:type", Array)
], User.prototype, "wonGames", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => matchHistoryEntry_entity_1.MatchHistoryEntry, (entry) => entry.looser),
    __metadata("design:type", Array)
], User.prototype, "lostGames", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "total_wins", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "total_losses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => archivments_entity_1.Archivements, (arch) => arch.holder),
    __metadata("design:type", Array)
], User.prototype, "archivements", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
User = User_1 = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map