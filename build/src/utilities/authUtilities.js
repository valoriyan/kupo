"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function generateRefreshToken({ userId, jwtPrivateKey, }) {
    const oneHour = 60 * 60;
    const jwtData = {
        userId,
    };
    return jsonwebtoken_1.sign({
        data: jwtData,
    }, jwtPrivateKey, { expiresIn: oneHour });
}
exports.generateRefreshToken = generateRefreshToken;
function generateAccessToken({ userId, jwtPrivateKey, }) {
    const fiveMinutes = 5 * 60;
    const jwtData = {
        userId,
    };
    return jsonwebtoken_1.sign({
        data: jwtData,
    }, jwtPrivateKey, { expiresIn: fiveMinutes });
}
exports.generateAccessToken = generateAccessToken;
