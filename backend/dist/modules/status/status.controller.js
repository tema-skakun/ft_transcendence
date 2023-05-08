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
exports.StatusController = void 0;
const common_1 = require("@nestjs/common");
const status_service_1 = require("./status.service");
const common_2 = require("@nestjs/common");
const Jwt2F_guard_1 = require("../../GuardStrategies/Jwt2F.guard");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../entities");
const typeorm_2 = require("typeorm");
let StatusController = class StatusController {
    statusService;
    userRep;
    constructor(statusService, userRep) {
        this.statusService = statusService;
        this.userRep = userRep;
    }
    async getStatus(req) {
        const requesterEntity = await this.userRep.findOne({
            where: {
                intra_id: req.user.intra_id
            },
            relations: ['friends']
        });
        const friends = new Set(requesterEntity.friends.map(friend => friend.intra_id));
        const filteredStatusMap = new Map();
        const statusMap = await this.statusService.getStatus();
        console.log(`This is my status Map size: ${statusMap.size}`);
        statusMap.forEach((stat, id) => {
            friends.forEach((intraId) => {
                if (id == intraId)
                    filteredStatusMap.set(id, stat);
            });
        });
        const retObj = {};
        filteredStatusMap.forEach((stat, key) => {
            retObj[key] = stat;
        });
        return retObj;
    }
};
__decorate([
    (0, common_2.Get)('/'),
    (0, common_1.UseGuards)(Jwt2F_guard_1.default),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatusController.prototype, "getStatus", null);
StatusController = __decorate([
    (0, common_1.Controller)('status'),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [status_service_1.StatusService,
        typeorm_2.Repository])
], StatusController);
exports.StatusController = StatusController;
//# sourceMappingURL=status.controller.js.map