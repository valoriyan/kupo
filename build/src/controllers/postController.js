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
exports.PostController = void 0;
const tsoa_1 = require("tsoa");
const tsyringe_1 = require("tsyringe");
const blobStorageService_1 = require("../services/blobStorageService");
const databaseService_1 = require("../services/databaseService");
const uuid_1 = require("uuid");
var PostPrivacySetting;
(function (PostPrivacySetting) {
    PostPrivacySetting["Tier2AndTier3"] = "Tier2AndTier3";
})(PostPrivacySetting || (PostPrivacySetting = {}));
var PostDurationSetting;
(function (PostDurationSetting) {
    PostDurationSetting["Forever"] = "Forever";
})(PostDurationSetting || (PostDurationSetting = {}));
var CreatePostFailureReasons;
(function (CreatePostFailureReasons) {
    CreatePostFailureReasons["UnknownCause"] = "Unknown Cause";
})(CreatePostFailureReasons || (CreatePostFailureReasons = {}));
let PostController = class PostController extends tsoa_1.Controller {
    constructor(blobStorageService, databaseService) {
        super();
        this.blobStorageService = blobStorageService;
        this.databaseService = databaseService;
    }
    createPost(caption, visibility, duration, title, price, collaboratorUsernames, scheduledPublicationTimestamp, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageId = uuid_1.v4();
            const imageBuffer = file.buffer;
            const { fileKey: imageBlobFilekey } = yield this.blobStorageService.saveImage({
                image: imageBuffer,
            });
            try {
                yield this.databaseService.postsTableService.createPost({
                    imageId, caption, imageBlobFilekey, title, price, scheduledPublicationTimestamp,
                });
                return {};
            }
            catch (error) {
                console.log("error", error);
                this.setStatus(401);
                return { error: { reason: CreatePostFailureReasons.UnknownCause } };
            }
        });
    }
};
__decorate([
    tsoa_1.Post("create"),
    __param(0, tsoa_1.FormField()),
    __param(1, tsoa_1.FormField()),
    __param(2, tsoa_1.FormField()),
    __param(3, tsoa_1.FormField()),
    __param(4, tsoa_1.FormField()),
    __param(5, tsoa_1.FormField()),
    __param(6, tsoa_1.FormField()),
    __param(7, tsoa_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Array, Number, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
PostController = __decorate([
    tsyringe_1.injectable(),
    tsoa_1.Route("post"),
    __metadata("design:paramtypes", [blobStorageService_1.LocalBlobStorageService,
        databaseService_1.DatabaseService])
], PostController);
exports.PostController = PostController;
