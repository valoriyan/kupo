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
exports.UserPageController = void 0;
const tsoa_1 = require("tsoa");
var DefaultPostPrivacySetting;
(function (DefaultPostPrivacySetting) {
    DefaultPostPrivacySetting["PublicAndGuestCheckout"] = "PublicAndGuestCheckout";
})(DefaultPostPrivacySetting || (DefaultPostPrivacySetting = {}));
var DeniedGetUserPageResponseReason;
(function (DeniedGetUserPageResponseReason) {
    DeniedGetUserPageResponseReason["Blocked"] = "Blocked";
})(DeniedGetUserPageResponseReason || (DeniedGetUserPageResponseReason = {}));
let UserPageController = class UserPageController extends tsoa_1.Controller {
    setUserSettings(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getPostsPage(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                success: {
                    username: requestBody.data.username,
                    followers: {
                        count: 3000,
                    },
                    subscribers: {
                        count: 83,
                    },
                    follows: {
                        count: 5,
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
    tsoa_1.Post("GetPosts"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserPageController.prototype, "getPostsPage", null);
UserPageController = __decorate([
    tsoa_1.Route("user")
], UserPageController);
exports.UserPageController = UserPageController;
