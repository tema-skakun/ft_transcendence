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
exports.LadderController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const ladder_service_1 = require("./ladder.service");
let LadderController = class LadderController {
    ladderService;
    usrService;
    constructor(ladderService, usrService) {
        this.ladderService = ladderService;
        this.usrService = usrService;
    }
    async percentile(intraId) {
        const winsToLosses = await this.usrService.getWinsToLossesArray();
        const myWinToLoss = await this.usrService.getWinsToLossesRatio(intraId);
        if (typeof myWinToLoss === 'string') {
            return "not ranked yet";
        }
        const index = winsToLosses.indexOf(myWinToLoss);
        console.log(winsToLosses.length);
        console.log(index);
        console.log(index / winsToLosses.length);
        return (index / winsToLosses.length) * 100;
    }
    async winsToLossesAll() {
        return this.usrService.getWinsToLossesArray();
    }
    async winsToLosses(intraId) {
        return this.usrService.getWinsToLossesRatio(intraId);
    }
};
__decorate([
    (0, common_1.Get)('/percentile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LadderController.prototype, "percentile", null);
__decorate([
    (0, common_1.Get)('winsToLossesAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LadderController.prototype, "winsToLossesAll", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LadderController.prototype, "winsToLosses", null);
LadderController = __decorate([
    (0, common_1.Controller)('ladder'),
    __metadata("design:paramtypes", [ladder_service_1.LadderService,
        user_service_1.UserService])
], LadderController);
exports.LadderController = LadderController;
//# sourceMappingURL=ladder.controller.js.map