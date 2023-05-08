"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HUMAN_LOGGER = exports.LOGGER = void 0;
const winston = require("winston");
exports.LOGGER = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
    })),
    transports: [
        new winston.transports.File({ filename: 'pong.log.json',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()) })
    ]
});
exports.HUMAN_LOGGER = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
    })),
    transports: [
        new winston.transports.File({ filename: 'pong.log',
            format: winston.format.combine(winston.format.timestamp(), winston.format.simple()) })
    ]
});
//# sourceMappingURL=logger.js.map