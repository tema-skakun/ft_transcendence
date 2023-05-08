import * as math from "mathjs";
export declare enum Key {
    NoKey = 0,
    ArrowUp = 1,
    ArrowDown = 2
}
export interface Velocity {
    x: number;
    y: number;
}
export declare const randomVelocity: () => math.Matrix;
export interface ConfigInter {
    POINTS: number;
    BACKGROUND_COLOR: string;
    SPAWN_EXCLUSION: number;
    UPDATE_INTERVAL: number;
    DEGREES: number;
    WIDTH: number;
    HEIGHT: number;
    DOT_WIDTH: number;
    DOT_HEIGHT: number;
    DOT_COLOR: string;
    PADDLE_HEIGHT: number;
    PADDLE_WIDTH: number;
    PADDLE_COLOR: string;
    PADDING: number;
    initialState: {
        dotCoordinate: {
            x: number;
            y: number;
        };
        paddleY: number;
        paddleY2: number;
    };
}
declare const _default: {
    POINTS: number;
    MAX_VEL: number;
    BACKGROUND_COLOR: string;
    SPAWN_EXCLUSION: number;
    UPDATE_INTERVAL: number;
    DEGREES: number;
    WIDTH: number;
    HEIGHT: number;
    DOT_WIDTH: number;
    DOT_HEIGHT: number;
    DOT_COLOR: string;
    PADDLE_HEIGHT: number;
    PADDLE_WIDTH: number;
    PADDLE_COLOR: string;
    PADDING: number;
    PADDLE_SPEED: number;
    BUMPS_TILL_MAX_SPEED: number;
    initialState: {
        dotCoordinate: {
            x: number;
            y: any;
        };
        paddleY: number;
        paddleY2: number;
        player1: Key;
        player2: Key;
        goalsPlayer1: number;
        goalsPlayer2: number;
    };
};
export default _default;
