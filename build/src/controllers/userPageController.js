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
exports.UserPageController = void 0;
const express_1 = __importDefault(require("express"));
const tsoa_1 = require("tsoa");
const tsyringe_1 = require("tsyringe");
const databaseService_1 = require("../services/databaseService");
const authUtilities_1 = require("./auth/authUtilities");
var DefaultPostPrivacySetting;
(function (DefaultPostPrivacySetting) {
    DefaultPostPrivacySetting["PublicAndGuestCheckout"] = "PublicAndGuestCheckout";
})(DefaultPostPrivacySetting || (DefaultPostPrivacySetting = {}));
var DeniedGetUserProfileResponseReason;
(function (DeniedGetUserProfileResponseReason) {
    DeniedGetUserProfileResponseReason["Blocked"] = "Blocked";
    DeniedGetUserProfileResponseReason["NotFound"] = "User Not Found";
})(DeniedGetUserProfileResponseReason || (DeniedGetUserProfileResponseReason = {}));
let UserPageController = class UserPageController extends tsoa_1.Controller {
    constructor(databaseService) {
        super();
        this.databaseService = databaseService;
    }
    setUserSettings(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(requestBody);
            return {};
        });
    }
    getUserProfile(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, error } = yield authUtilities_1.checkAuthorization(this, request);
            if (error)
                return error;
            const user = yield this.databaseService.usersTableService.selectUserByUserId({
                userId,
            });
            if (!user) {
                this.setStatus(404);
                return { error: { reason: DeniedGetUserProfileResponseReason.NotFound } };
            }
            return {
                success: {
                    username: user.username,
                    followers: {
                        count: 9001,
                    },
                    subscribers: {
                        count: 69,
                    },
                    follows: {
                        count: 420,
                    },
                    bio: "I really like cats, if you couldn't tell already.",
                    posts: [],
                    shopItems: [],
                },
            };
        });
    }
};
__decorate([
    tsoa_1.Post("SetSettings"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserPageController.prototype, "setUserSettings", null);
__decorate([
    tsoa_1.Post("GeUserProfile"),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserPageController.prototype, "getUserProfile", null);
UserPageController = __decorate([
    tsyringe_1.injectable(),
    tsoa_1.Route("user"),
    __metadata("design:paramtypes", [databaseService_1.DatabaseService])
], UserPageController);
exports.UserPageController = UserPageController;
