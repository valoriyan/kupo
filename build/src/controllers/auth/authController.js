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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const crypto_js_1 = require("crypto-js");
const database_1 = require("../../database");
const tsoa_1 = require("tsoa");
const authUtilities_1 = require("../../utilities/authUtilities");
const uuid_1 = require("uuid");
var AuthFailureReason;
(function (AuthFailureReason) {
    AuthFailureReason["WrongPassword"] = "Wrong Password";
    AuthFailureReason["UnknownCause"] = "Unknown Cause";
})(AuthFailureReason || (AuthFailureReason = {}));
var DeniedPasswordResetResponseReason;
(function (DeniedPasswordResetResponseReason) {
    DeniedPasswordResetResponseReason["TooManyAttempts"] = "Too Many Attempts";
})(DeniedPasswordResetResponseReason || (DeniedPasswordResetResponseReason = {}));
function encryptPassword({ password, }) {
    const salt = process.env.SALT;
    return crypto_js_1.MD5(salt + password).toString();
}
let AuthController = class AuthController extends tsoa_1.Controller {
    registerUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = uuid_1.v4();
            const { email, username, password } = requestBody;
            const datastorePool = yield database_1.DatabaseService.get();
            const encryptedPassword = encryptPassword({ password });
            const queryString = `
        INSERT INTO playhousedevtable(
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
                this.setStatus(201);
                return {
                    success: {
                        accessToken: authUtilities_1.generateAccessToken({
                            userId,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
                        }),
                        refreshToken: authUtilities_1.generateRefreshToken({
                            userId,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
                        }),
                    },
                };
            }
            catch (error) {
                console.log("error", error);
                this.setStatus(401);
                return {
                    error: {
                        reason: AuthFailureReason.UnknownCause,
                    },
                };
            }
        });
    }
    loginUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = requestBody;
            const datastorePool = yield database_1.DatabaseService.get();
            try {
                const queryString = `
            SELECT
              *
            FROM
              playhousedevtable
            WHERE
              email = '${email}';
          `;
                const response = yield datastorePool.query(queryString);
                const rows = response.rows;
                if (rows.length === 1) {
                    const row = rows[0];
                    const hasMatchedPassword = encryptPassword({ password }) === row.encryptedpassword;
                    if (hasMatchedPassword) {
                        const userId = row.id;
                        this.setStatus(200);
                        return {
                            success: {
                                accessToken: authUtilities_1.generateAccessToken({
                                    userId,
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
                                }),
                                refreshToken: authUtilities_1.generateRefreshToken({
                                    userId,
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
                                }),
                            },
                        };
                    }
                }
                this.setStatus(401);
                return {
                    error: {
                        reason: AuthFailureReason.WrongPassword,
                    },
                };
            }
            catch (error) {
                console.log("error", error);
                this.setStatus(401);
                return {
                    error: {
                        reason: AuthFailureReason.UnknownCause,
                    },
                };
            }
        });
    }
    requestPasswordReset(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(requestBody);
            return {
                success: {},
            };
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
    tsoa_1.Post("resetPassword"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPasswordReset", null);
AuthController = __decorate([
    tsoa_1.Route("auth")
], AuthController);
exports.AuthController = AuthController;
