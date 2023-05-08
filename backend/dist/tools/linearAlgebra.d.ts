import * as math from "mathjs";
export declare function getNewVelocity(hitPoint: number, velocity: math.Matrix): math.Matrix;
export declare function deflection({ velocity, paddle }: DeflectionParameters): math.Matrix;
interface DeflectionParameters {
    velocity: math.Matrix;
    paddle?: {
        hitPoint: number;
        paddleNr: number;
    };
}
export declare function getHitPoint(box1: math.Matrix, box2: math.Matrix): number;
export {};
