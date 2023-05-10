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
exports.MatchHistoryTransformed = void 0;
const class_transformer_1 = require("class-transformer");
const objectPruning_1 = require("../../tools/objectPruning");
const user_transformed_1 = require("../user/user.transformed");
class MatchHistoryTransformed {
    id;
    played_at;
    looser;
    winner;
    looserGoals;
    winnerGoals;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MatchHistoryTransformed.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], MatchHistoryTransformed.prototype, "played_at", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, objectPruning_1.ObjectPruning)(user_transformed_1.UserTransformed, value)),
    __metadata("design:type", user_transformed_1.UserTransformed)
], MatchHistoryTransformed.prototype, "looser", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, objectPruning_1.ObjectPruning)(user_transformed_1.UserTransformed, value)),
    __metadata("design:type", user_transformed_1.UserTransformed)
], MatchHistoryTransformed.prototype, "winner", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MatchHistoryTransformed.prototype, "looserGoals", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MatchHistoryTransformed.prototype, "winnerGoals", void 0);
exports.MatchHistoryTransformed = MatchHistoryTransformed;
//# sourceMappingURL=matchHistoryEntry.transformed.js.map