"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.AuthFailureReason = void 0;
const crypto_js_1 = require("crypto-js");
const express_1 = __importDefault(require("express"));
const luxon_1 = require("luxon");
const databaseService_1 = require("../../services/databaseService");
const tsoa_1 = require("tsoa");
const authUtilities_1 = require("../../utilities/authUtilities");
const uuid_1 = require("uuid");
const emailService_1 = require("../../services/emailService");
const tsyringe_1 = require("tsyringe");
var AuthFailureReason;
(function (AuthFailureReason) {
    AuthFailureReason["WrongPassword"] = "Wrong Password";
    AuthFailureReason["UnknownCause"] = "Unknown Cause";
    AuthFailureReason["NoRefreshToken"] = "No Refresh Token Found";
    AuthFailureReason["InvalidToken"] = "Failed To Validate Token";
    AuthFailureReason["TokenGenerationFailed"] = "Failed To Generate Access Token";
    AuthFailureReason["AuthorizationError"] = "You Must Be Logged In";
})(AuthFailureReason = exports.AuthFailureReason || (exports.AuthFailureReason = {}));
var DeniedPasswordResetResponseReason;
(function (DeniedPasswordResetResponseReason) {
    DeniedPasswordResetResponseReason["TooManyAttempts"] = "Too Many Attempts";
})(DeniedPasswordResetResponseReason || (DeniedPasswordResetResponseReason = {}));
function encryptPassword({ password }) {
    const salt = process.env.SALT;
    return crypto_js_1.MD5(salt + password).toString();
}
let AuthController = class AuthController extends tsoa_1.Controller {
    constructor(localEmailService) {
        super();
        this.localEmailService = localEmailService;
    }
    registerUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = uuid_1.v4();
            const { email, username, password } = requestBody;
            const datastorePool = yield databaseService_1.DatabaseService.get();
            const encryptedPassword = encryptPassword({ password });
            const queryString = `
      INSERT INTO ${databaseService_1.DatabaseService.userTableName}(
        id,
        email,
        username,
        encryptedpassword
      )
      VALUES (
        '${userId}',
        '${email}',
        '${username}',
        '${encryptedPassword}'
      )
      ;
    `;
            try {
                yield datastorePool.query(queryString);
                return grantNewAccessToken({
                    controller: this,
                    userId,
                    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
                    successStatusCode: 201,
                });
            }
            catch (error) {
                console.log("error", error);
                this.setStatus(401);
                return { error: { reason: AuthFailureReason.UnknownCause } };
            }
        });
    }
    loginUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = requestBody;
            const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
            const datastorePool = yield databaseService_1.DatabaseService.get();
            try {
                const queryString = `
        SELECT
          *
        FROM
          ${databaseService_1.DatabaseService.userTableName}
        WHERE
          username = '${username}';
      `;
                const response = yield datastorePool.query(queryString);
                const rows = response.rows;
                if (rows.length === 1) {
                    const row = rows[0];
                    const hasMatchedPassword = encryptPassword({ password }) === row.encryptedpassword;
                    if (hasMatchedPassword) {
                        const userId = row.id;
                        return grantNewAccessToken({ controller: this, userId, jwtPrivateKey });
                    }
                }
                this.setStatus(401);
                return { error: { reason: AuthFailureReason.WrongPassword } };
            }
            catch (error) {
                console.log("error", error);
                this.setStatus(401);
                return { error: { reason: AuthFailureReason.UnknownCause } };
            }
        });
    }
    refreshAccessToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = request.cookies.refreshToken;
            const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
            if (!refreshToken) {
                this.setStatus(401);
                return { error: { reason: AuthFailureReason.NoRefreshToken } };
            }
            let userId;
            try {
                userId = authUtilities_1.validateTokenAndGetUserId({
                    token: refreshToken,
                    jwtPrivateKey,
                });
            }
            catch (_a) {
                this.setStatus(401);
                return { error: { reason: AuthFailureReason.InvalidToken } };
            }
            try {
                return grantNewAccessToken({ controller: this, userId, jwtPrivateKey });
            }
            catch (_b) {
                this.setStatus(401);
                return { error: { reason: AuthFailureReason.TokenGenerationFailed } };
            }
        });
    }
    requestPasswordReset(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.localEmailService.sendResetPasswordEmail({ userId: requestBody.email });
            return {
                success: {},
            };
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setHeader("Set-Cookie", `refreshToken=deleted; HttpOnly; Secure; Expires=${new Date(0).toUTCString()};`);
            this.setStatus(200);
        });
    }
};
__decorate([
    tsoa_1.Post("register"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    tsoa_1.Post("login"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    tsoa_1.Get("refresh-access-token"),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshAccessToken", null);
__decorate([
    tsoa_1.Post("resetPassword"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPasswordReset", null);
__decorate([
    tsoa_1.Get("logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    tsyringe_1.injectable(),
    tsoa_1.Route("auth"),
    __metadata("design:paramtypes", [emailService_1.LocalEmailService])
], AuthController);
exports.AuthController = AuthController;
const grantNewAccessToken = ({ controller, userId, jwtPrivateKey, successStatusCode = 200, }) => {
    const accessToken = authUtilities_1.generateAccessToken({
        userId,
        jwtPrivateKey,
    });
    const refreshToken = authUtilities_1.generateRefreshToken({
        userId,
        jwtPrivateKey,
    });
    const tokenExpirationTime = luxon_1.DateTime.now()
        .plus(authUtilities_1.REFRESH_TOKEN_EXPIRATION_TIME * 1000)
        .toJSDate()
        .toUTCString();
    controller.setHeader("Set-Cookie", `refreshToken=${refreshToken}; HttpOnly; Secure; Expires=${tokenExpirationTime}`);
    controller.setStatus(successStatusCode);
    return { success: { accessToken } };
};
