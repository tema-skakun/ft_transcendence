"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchivementsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const archivments_entity_1 = require("../../entities/archivements/archivments.entity");
const user_module_1 = require("../user/user.module");
const archivements_controller_1 = require("./archivements.controller");
const archivements_service_1 = require("./archivements.service");
let ArchivementsModule = class ArchivementsModule {
};
ArchivementsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([archivments_entity_1.Archivements]), user_module_1.UserModule],
        controllers: [archivements_controller_1.ArchivementsController],
        providers: [archivements_service_1.ArchivementsService],
        exports: [archivements_service_1.ArchivementsService]
    })
], ArchivementsModule);
exports.ArchivementsModule = ArchivementsModule;
//# sourceMappingURL=archivements.module.js.map