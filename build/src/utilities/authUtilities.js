"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokenAndGetUserId = exports.generateAccessToken = exports.generateRefreshToken = exports.ACCESS_TOKEN_EXPIRATION_TIME = exports.REFRESH_TOKEN_EXPIRATION_TIME = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
exports.REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7; // one week
exports.ACCESS_TOKEN_EXPIRATION_TIME = 5 * 60; // five minutes
function generateRefreshToken({ userId, jwtPrivateKey, }) {
    const expiresIn = exports.REFRESH_TOKEN_EXPIRATION_TIME;
    const jwtData = {
        userId,
    };
    return jsonwebtoken_1.sign({ data: jwtData }, jwtPrivateKey, { expiresIn });
}
exports.generateRefreshToken = generateRefreshToken;
function generateAccessToken({ userId, jwtPrivateKey, }) {
    const expiresIn = exports.ACCESS_TOKEN_EXPIRATION_TIME;
    const jwtData = {
        userId,
    };
    return jsonwebtoken_1.sign({ data: jwtData }, jwtPrivateKey, { expiresIn });
}
exports.generateAccessToken = generateAccessToken;
function validateTokenAndGetUserId({ token, jwtPrivateKey, }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessTokenData = jsonwebtoken_1.verify(token, jwtPrivateKey);
    const { userId } = accessTokenData;
    return userId;
}
exports.validateTokenAndGetUserId = validateTokenAndGetUserId;
