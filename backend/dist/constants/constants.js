"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomVelocity = exports.Key = void 0;
const math = require("mathjs");
var Key;
(function (Key) {
    Key[Key["NoKey"] = 0] = "NoKey";
    Key[Key["ArrowUp"] = 1] = "ArrowUp";
    Key[Key["ArrowDown"] = 2] = "ArrowDown";
})(Key = exports.Key || (exports.Key = {}));
const HEIGHT = 600;
const WIDTH = HEIGHT * (1 + 1 / 2);
const DOT_WIDTH = 50;
const DOT_HEIGHT = 50;
const PADDLE_HEIGHT = HEIGHT / 8;
const PADDLE_WIDTH = WIDTH / 60;
const randomVelocity = () => math.matrix([
    [(math.random(0, 1) < 0.5) ? -WIDTH / (5 + 1 / 3) / 60 : WIDTH / (5 + 1 / 3) / 60],
    [0]
]);
exports.randomVelocity = randomVelocity;
exports.default = {
    POINTS: 2,
    MAX_VEL: WIDTH / (2 + 2 / 3) / 60,
    BACKGROUND_COLOR: 'red',
    SPAWN_EXCLUSION: HEIGHT / 4,
    UPDATE_INTERVAL: 1000 / 60,
    DEGREES: 45,
    WIDTH: WIDTH,
    HEIGHT: HEIGHT,
    DOT_WIDTH: WIDTH / 60,
    DOT_HEIGHT: WIDTH / 60,
    DOT_COLOR: "white",
    PADDLE_HEIGHT: PADDLE_HEIGHT,
    PADDLE_WIDTH: PADDLE_WIDTH,
    PADDLE_COLOR: "violet",
    PADDING: PADDLE_WIDTH,
    PADDLE_SPEED: WIDTH / (5 + 1 / 3),
    BUMPS_TILL_MAX_SPEED: 12,
    initialState: {
        dotCoordinate: {
            x: WIDTH / 2 - (DOT_WIDTH / 2),
            y: undefined,
        },
        paddleY: HEIGHT / 2 - (PADDLE_HEIGHT / 2),
        paddleY2: HEIGHT / 2 - (PADDLE_HEIGHT / 2),
        player1: Key.NoKey,
        player2: Key.NoKey,
        goalsPlayer1: 0,
        goalsPlayer2: 0
    },
};
//# sourceMappingURL=constants.js.map