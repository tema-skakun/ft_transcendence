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
exports.MatchHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const matchHistoryEntry_entity_1 = require("../../../entities/matchHistoryEntry/matchHistoryEntry.entity");
const typeorm_2 = require("typeorm");
let MatchHistoryService = class MatchHistoryService {
    rep;
    constructor(rep) {
        this.rep = rep;
    }
    create(mh) {
        const matchHistoryEntry = new matchHistoryEntry_entity_1.MatchHistoryEntry();
        matchHistoryEntry.winner = mh.winner;
        matchHistoryEntry.winnerGoals = mh.winnerGoals;
        matchHistoryEntry.looser = mh.looser;
        matchHistoryEntry.looserGoals = mh.looserGoals;
        return this.rep.save(matchHistoryEntry);
    }
    save(mh) {
        return this.rep.save(mh);
    }
    async get(intraId) {
        return (this.rep.createQueryBuilder('match')
            .leftJoinAndSelect('match.winner', 'winner')
            .leftJoinAndSelect('match.looser', 'looser')
            .where("winner.intra_id = :intraId", { intraId })
            .orWhere("looser.intra_id = :intraId", { intraId })
            .getMany());
    }
};
MatchHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(matchHistoryEntry_entity_1.MatchHistoryEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MatchHistoryService);
exports.MatchHistoryService = MatchHistoryService;
//# sourceMappingURL=match-history.service.js.map