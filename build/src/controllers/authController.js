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
const database_1 = require("../database");
const tsoa_1 = require("tsoa");
const salt = "";
let AuthController = class AuthController extends tsoa_1.Controller {
    registerUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201);
            const datastorePool = yield database_1.DatabaseService.get();
            const encryptedPassword = crypto_js_1.MD5(salt + requestBody.password).toString();
            const queryString = `
        INSERT INTO playhousedevtable(email, username, encryptedpassword)
        VALUES ('${requestBody.email}', '${requestBody.username}', '${encryptedPassword}')
        ;
      `;
            try {
                const response = yield datastorePool.query(queryString);
                console.log(response);
            }
            catch (error) {
                console.log("error", error);
            }
            return {
                accessToken: "string",
                refreshToken: "string",
            };
        });
    }
    loginUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(200);
            const datastorePool = yield database_1.DatabaseService.get();
            const response = yield datastorePool.query(`
        SELECT
          *
        FROM
          playhouseDev
        WHERE
          email = ${requestBody.email}
    `);
            console.log(response);
            console.log(requestBody);
            return {
                accessToken: "string",
                refreshToken: "string",
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
AuthController = __decorate([
    tsoa_1.Route("auth")
], AuthController);
exports.AuthController = AuthController;
