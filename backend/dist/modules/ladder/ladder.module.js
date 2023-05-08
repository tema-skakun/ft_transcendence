"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LadderModule = void 0;
const common_1 = require("@nestjs/common");
const ladder_service_1 = require("./ladder.service");
const ladder_controller_1 = require("./ladder.controller");
const match_history_module_1 = require("../game/match-history/match-history.module");
const user_module_1 = require("../user/user.module");
let LadderModule = class LadderModule {
};
LadderModule = __decorate([
    (0, common_1.Module)({
        imports: [match_history_module_1.MatchHistoryModule, user_module_1.UserModule],
        providers: [ladder_service_1.LadderService],
        controllers: [ladder_controller_1.LadderController]
    })
], LadderModule);
exports.LadderModule = LadderModule;
//# sourceMappingURL=ladder.module.js.map