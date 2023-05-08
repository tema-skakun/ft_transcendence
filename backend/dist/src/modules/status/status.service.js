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
exports.StatusService = exports.ClientStatus = void 0;
const common_1 = require("@nestjs/common");
const game_gateway_1 = require("../game/game.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user/user.entity");
var ClientStatus;
(function (ClientStatus) {
    ClientStatus["CONNECTED"] = "CONNECTED";
    ClientStatus["INGAME"] = "INGAME";
    ClientStatus["OFFLINE"] = "OFFLINE";
})(ClientStatus = exports.ClientStatus || (exports.ClientStatus = {}));
let StatusService = class StatusService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async getStatus() {
        const statusMap = new Map();
        const dbClients = await this.userRepo.find();
        dbClients.forEach((dbClient) => {
            game_gateway_1.clients.forEach((client) => {
                if (client.intraId === dbClient.intra_id)
                    statusMap.set(dbClient.intra_id, ClientStatus.OFFLINE);
            });
        });
        game_gateway_1.clients.forEach((client, socketId) => {
            statusMap.set(game_gateway_1.clients.get(socketId).intraId, client.inGame ? ClientStatus.INGAME : ClientStatus.CONNECTED);
        });
        return statusMap;
    }
};
StatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StatusService);
exports.StatusService = StatusService;
//# sourceMappingURL=status.service.js.map