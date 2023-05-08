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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../constants/constants");
const math = require("mathjs");
const linearAlgebra_1 = require("../../tools/linearAlgebra");
const converter_1 = require("../../tools/converter");
const mathjs_1 = require("mathjs");
const physicalObjects_1 = require("../../tools/physicalObjects");
const UserRestriction_1 = require("../../classes/UserRestriction");
const trivial_1 = require("../../tools/trivial");
const UPPERBOUND = math.matrix([
    [0, constants_1.default.WIDTH],
    [constants_1.default.HEIGHT, constants_1.default.HEIGHT + 10]
]);
const LOWERBOUND = math.matrix([
    [0, constants_1.default.WIDTH],
    [10, 0]
]);
let GameService = class GameService {
    relations;
    userRestriction;
    constructor(relations, userRestriction) {
        this.relations = relations;
        this.userRestriction = userRestriction;
    }
    createGame(player2) {
        player2.gameState = { ...constants_1.default.initialState, dotCoordinate: { ...constants_1.default.initialState.dotCoordinate }, velocity: (0, constants_1.randomVelocity)() };
    }
    physics(player2) {
        const gState = player2.gameState;
        const player1 = player2.otherPlayerObj;
        if (!gState.dotCoordinate.y)
            gState.dotCoordinate.y = (0, mathjs_1.random)(constants_1.default.SPAWN_EXCLUSION, constants_1.default.HEIGHT - constants_1.default.SPAWN_EXCLUSION);
        const Dot_box = (0, physicalObjects_1.getDotBox)(gState);
        const Paddle_box = (0, physicalObjects_1.getPaddleBox)(gState);
        const Paddle_box2 = (0, physicalObjects_1.getPaddleBox2)(gState);
        let hitPoint = 0;
        if ((0, linearAlgebra_1.getHitPoint)(Dot_box, UPPERBOUND) || (0, linearAlgebra_1.getHitPoint)(Dot_box, LOWERBOUND)) {
            gState.velocity = (0, linearAlgebra_1.deflection)({ velocity: gState.velocity });
        }
        if ((hitPoint = (0, linearAlgebra_1.getHitPoint)(Dot_box, Paddle_box)) !== undefined) {
            gState.velocity = (0, linearAlgebra_1.deflection)({ velocity: gState.velocity, paddle: { hitPoint: hitPoint, paddleNr: 1 } });
        }
        if ((hitPoint = (0, linearAlgebra_1.getHitPoint)(Dot_box, Paddle_box2)) !== undefined) {
            gState.velocity = (0, linearAlgebra_1.deflection)({ velocity: gState.velocity, paddle: { hitPoint: hitPoint, paddleNr: 2 } });
        }
        gState.dotCoordinate.x += gState.velocity.get([0, 0]);
        gState.dotCoordinate.y += gState.velocity.get([1, 0]);
        if (player1.key === constants_1.Key.ArrowUp) {
            if ((gState.paddleY) < 0) { }
            else
                gState.paddleY -= constants_1.default.PADDLE_SPEED / 60;
        }
        if (player2.key === constants_1.Key.ArrowUp) {
            if ((gState.paddleY2) < 0) { }
            else
                gState.paddleY2 -= constants_1.default.PADDLE_SPEED / 60;
        }
        if (player1.key === constants_1.Key.ArrowDown) {
            if ((gState.paddleY + constants_1.default.PADDLE_HEIGHT) > constants_1.default.HEIGHT) { }
            else
                gState.paddleY += constants_1.default.PADDLE_SPEED / 60;
        }
        if (player2.key === constants_1.Key.ArrowDown) {
            if ((gState.paddleY2 + constants_1.default.PADDLE_HEIGHT) > constants_1.default.HEIGHT) { }
            else
                gState.paddleY2 += constants_1.default.PADDLE_SPEED / 60;
        }
    }
    goals(player2) {
        const gState = player2.gameState;
        const dotCoordinate = gState.dotCoordinate;
        const x = dotCoordinate.x;
        const y = dotCoordinate.y;
        const CONFIG_X = constants_1.default.initialState.dotCoordinate.x;
        const WIDTH = constants_1.default.WIDTH;
        if (x < 0) {
            dotCoordinate.x = CONFIG_X;
            gState.dotCoordinate.y = (0, trivial_1.spawnY)();
            gState.velocity = (0, constants_1.randomVelocity)();
            return ('goal player2');
        }
        else if (x > WIDTH) {
            dotCoordinate.x = CONFIG_X;
            gState.dotCoordinate.y = (0, trivial_1.spawnY)();
            gState.velocity = (0, constants_1.randomVelocity)();
            return ('goal player1');
        }
        return ('none');
    }
    keyChange(code, player, activate) {
        if (!activate) {
            player.key = constants_1.Key.NoKey;
            return;
        }
        if (code == 'ArrowDown')
            player.key = constants_1.Key.ArrowDown;
        else if (code == 'ArrowUp')
            player.key = constants_1.Key.ArrowUp;
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [converter_1.RelationalTable,
        UserRestriction_1.UserRestriction])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=gameService.js.map