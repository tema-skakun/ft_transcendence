"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaddleBox2 = exports.getPaddleBox = exports.getDotBox = void 0;
const math = require("mathjs");
const constants_1 = require("../constants/constants");
function getDotBox(gState) {
    return math.matrix([
        [gState.dotCoordinate.x, gState.dotCoordinate.x + constants_1.default.DOT_WIDTH],
        [gState.dotCoordinate.y, gState.dotCoordinate.y + constants_1.default.DOT_HEIGHT],
    ]);
}
exports.getDotBox = getDotBox;
function getPaddleBox(gState) {
    return math.matrix([
        [constants_1.default.PADDING, constants_1.default.PADDING + constants_1.default.PADDLE_WIDTH],
        [gState.paddleY, gState.paddleY + constants_1.default.PADDLE_HEIGHT],
    ]);
}
exports.getPaddleBox = getPaddleBox;
function getPaddleBox2(gState) {
    return math.matrix([
        [
            constants_1.default.WIDTH - constants_1.default.PADDING - constants_1.default.PADDLE_WIDTH,
            constants_1.default.WIDTH - constants_1.default.PADDING,
        ],
        [gState.paddleY2, gState.paddleY2 + constants_1.default.PADDLE_HEIGHT],
    ]);
}
exports.getPaddleBox2 = getPaddleBox2;
//# sourceMappingURL=physicalObjects.js.map