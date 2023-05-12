"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHitPoint = exports.deflection = exports.getNewVelocity = void 0;
;
const constants_1 = require("../constants/constants");
const math = require("mathjs");
const rxjs_1 = require("rxjs");
function increaseMagnitudeMatrix(vector, p) {
    const currentMagnitude = math.sqrt(math.sum(math.dotMultiply(vector, vector)));
    if (currentMagnitude >= constants_1.default.MAX_VEL)
        return (vector);
    const unitVector = math.divide(vector, currentMagnitude);
    const newMagnitude = currentMagnitude + p;
    const newVector = math.multiply(unitVector, newMagnitude);
    return newVector;
}
const deflectionMatrixBorder = math.matrix([
    [1, 0],
    [0, -1]
]);
const identityMatrix = math.matrix([
    [1, 0],
    [0, 1]
]);
function getDeflectionMatrix(hitPoint, velocity) {
    const minAngle = -(Math.PI / 180) * constants_1.default.DEGREES;
    const maxAngle = (Math.PI / 180) * constants_1.default.DEGREES;
    let angle = hitPoint * (maxAngle - minAngle) / 2;
    if (velocity.get([0, 0]) < 0)
        angle = -angle;
    let deflectionMatrix = math.matrix([
        [-Math.cos(2 * angle), Math.sin(2 * angle)],
        [Math.sin(2 * angle), Math.cos(2 * angle)]
    ]);
    return deflectionMatrix;
}
function getNewVelocity(hitPoint, velocity) {
    const minAngle = -(Math.PI / 180) * constants_1.default.DEGREES;
    const maxAngle = (Math.PI / 180) * constants_1.default.DEGREES;
    let angle = hitPoint * (maxAngle - minAngle) / 2;
    const speed = Math.sqrt(Math.pow(velocity.get([0, 0]), 2) + Math.pow(velocity.get([1, 0]), 2));
    let newVelocity = math.matrix([
        [-speed * Math.cos(angle)],
        [speed * Math.sin(angle)]
    ]);
    if (velocity.get([0, 0]) < 0) {
        newVelocity.set([0, 0], -newVelocity.get([0, 0]));
    }
    return newVelocity;
}
exports.getNewVelocity = getNewVelocity;
function deflection({ velocity, paddle }) {
    let newVelocity = undefined;
    if (paddle) {
        newVelocity = getNewVelocity(paddle.hitPoint, velocity);
        if (newVelocity.get([0, 0]) < 0 && paddle.paddleNr === 1)
            return (velocity);
        if (newVelocity.get([0, 0]) > 0 && paddle.paddleNr === 2)
            return (velocity);
    }
    else {
        newVelocity = math.multiply(deflectionMatrixBorder, velocity);
    }
    if (!newVelocity)
        throw Error;
    newVelocity = increaseMagnitudeMatrix(newVelocity, (1 / constants_1.default.BUMPS_TILL_MAX_SPEED));
    return (newVelocity);
}
exports.deflection = deflection;
function getHitPoint(box1, box2) {
    const dimensions = box1.size();
    const dimensions2 = box2.size();
    if (dimensions[1] !== 2 || dimensions2[1] !== 2)
        throw rxjs_1.ArgumentOutOfRangeError;
    if (dimensions[0] !== dimensions2[0] || dimensions[0] < 2)
        throw rxjs_1.ArgumentOutOfRangeError;
    for (let i = 0; i < dimensions[0]; ++i) {
        const box1Min = box1.get([i, 0]);
        const box1Max = box1.get([i, 1]);
        const box2Min = box2.get([i, 0]);
        const box2Max = box2.get([i, 1]);
        if (box1Max < box2Min || box2Max < box1Min) {
            return undefined;
        }
    }
    const possibiltySpace = box2.get([1, 1]) - box2.get([1, 0]) + box1.get([1, 1]) - box1.get([1, 0]);
    const normed = ((box1.get([1, 1]) - box2.get([1, 0])) / possibiltySpace) * 2 - 1;
    return normed;
}
exports.getHitPoint = getHitPoint;
//# sourceMappingURL=linearAlgebra.js.map