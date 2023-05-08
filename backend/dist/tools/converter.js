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
exports.RelationalTable = exports.notFullyInitalized = exports.alreadyDeleted = void 0;
const common_1 = require("@nestjs/common");
const debug_service_1 = require("../debug/debug.service");
exports.alreadyDeleted = [];
exports.notFullyInitalized = [];
let RelationalTable = class RelationalTable {
    debug;
    rows = undefined;
    constructor(debug) {
        this.debug = debug;
        this.rows = new Map();
        this.debug.add(() => {
            let acc = "";
            for (const row of this.rows) {
                acc += `->${row[1].player1}, ${row[1].player2}, ${(row[1].gameState) ? "defined" : "undefined"}<-`;
            }
            return ["Relations", acc];
        });
    }
    getRelation(gid) {
        return this.rows.get(gid);
    }
    addRelation(gid, column) {
        if (!this.rows.has(gid)) {
            exports.notFullyInitalized.push(gid);
            this.rows.set(gid, { ...column });
        }
        else {
            exports.notFullyInitalized = exports.notFullyInitalized.filter((val) => {
                if (val === gid)
                    return false;
                return true;
            });
            this.rows.set(gid, this.mergeColumns(this.rows.get(gid), column));
        }
    }
    removeRelation(gid) {
        return this.rows.delete(gid);
        exports.alreadyDeleted.push(gid);
    }
    mergeColumns(a, b) {
        return ({
            player1: a.player1 === undefined ? b.player1 : a.player1,
            player2: a.player2 === undefined ? b.player2 : a.player2,
            gameState: a.gameState === undefined ? b.gameState : a.gameState
        });
    }
};
RelationalTable = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [debug_service_1.DebugService])
], RelationalTable);
exports.RelationalTable = RelationalTable;
//# sourceMappingURL=converter.js.map