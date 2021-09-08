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
exports.handleCreatePost = exports.CreatePostFailureReasons = exports.PostDurationSetting = exports.PostPrivacySetting = void 0;
const uuid_1 = require("uuid");
var PostPrivacySetting;
(function (PostPrivacySetting) {
    PostPrivacySetting["Tier2AndTier3"] = "Tier2AndTier3";
})(PostPrivacySetting = exports.PostPrivacySetting || (exports.PostPrivacySetting = {}));
var PostDurationSetting;
(function (PostDurationSetting) {
    PostDurationSetting["Forever"] = "Forever";
})(PostDurationSetting = exports.PostDurationSetting || (exports.PostDurationSetting = {}));
var CreatePostFailureReasons;
(function (CreatePostFailureReasons) {
    CreatePostFailureReasons["UnknownCause"] = "Unknown Cause";
})(CreatePostFailureReasons = exports.CreatePostFailureReasons || (exports.CreatePostFailureReasons = {}));
function handleCreatePost({ controller, request, requestBody, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = (0, uuid_1.v4)();
        const imageId = (0, uuid_1.v4)();
        const imageBuffer = requestBody.file.buffer;
        const { fileKey: imageBlobFilekey } = yield controller.blobStorageService.saveImage({
            image: imageBuffer,
        });
        try {
            yield controller.databaseService.tableServices.postsTableService.createPost({
                postId,
                creatorUserId: requestBody.creatorUserId,
                imageId,
                caption: requestBody.caption,
                imageBlobFilekey,
                title: requestBody.title,
                price: requestBody.price,
                scheduledPublicationTimestamp: requestBody.scheduledPublicationTimestamp,
            });
            return {};
        }
        catch (error) {
            console.log("error", error);
            controller.setStatus(401);
            return { error: { reason: CreatePostFailureReasons.UnknownCause } };
        }
    });
}
exports.handleCreatePost = handleCreatePost;
//# sourceMappingURL=handleCreatePost.js.map