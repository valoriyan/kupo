"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorization = exports.validateTokenAndGetUserId = exports.generateAccessToken = exports.generateRefreshToken = exports.ACCESS_TOKEN_EXPIRATION_TIME = exports.REFRESH_TOKEN_EXPIRATION_TIME = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const authController_1 = require("../controllers/auth/authController");
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
    const accessTokenData = jsonwebtoken_1.verify(token, jwtPrivateKey);
    if (typeof accessTokenData === "string")
        return accessTokenData;
    const { userId } = accessTokenData.data;
    return userId;
}
exports.validateTokenAndGetUserId = validateTokenAndGetUserId;
/**
 * Checks if the user if authorized
 * If they are, their userId is returned
 * If they are not, a 403 error is sent to the client
 */
function checkAuthorization(controller, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
        try {
            const token = request.query.token || request.headers["x-access-token"];
            if (!token)
                throw new Error("No token found");
            return { userId: validateTokenAndGetUserId({ token, jwtPrivateKey }) };
        }
        catch (_a) {
            controller.setStatus(403);
            return {
                userId: "",
                error: { error: { reason: authController_1.AuthFailureReason.AuthorizationError } },
            };
        }
    });
}
exports.checkAuthorization = checkAuthorization;
