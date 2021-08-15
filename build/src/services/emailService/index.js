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
exports.generateLocalEmailService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const RESET_PASSWORD_TOKEN_EXPIRATION_TIME = 60 * 60 * 2; // one week
function generateResetPasswordToken({ userId, jwtPrivateKey, }) {
    const expiresIn = RESET_PASSWORD_TOKEN_EXPIRATION_TIME;
    const jwtData = {
        resetPasswordData: {
            userId,
        },
    };
    return jsonwebtoken_1.sign({ data: jwtData }, jwtPrivateKey, { expiresIn });
}
function generateLocalEmailService({ jwtPrivateKey, }) {
    return __awaiter(this, void 0, void 0, function* () {
        function sendResetPasswordEmail({ userId }) {
            return __awaiter(this, void 0, void 0, function* () {
                const resetPasswordToken = generateResetPasswordToken({
                    userId,
                    jwtPrivateKey,
                });
                console.log(`
            To reset password, go to http://localhost:6006/resetpassword?token=${resetPasswordToken}
        `);
                return;
            });
        }
        return {
            sendResetPasswordEmail,
        };
    });
}
exports.generateLocalEmailService = generateLocalEmailService;
