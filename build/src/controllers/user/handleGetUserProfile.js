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
exports.handleGetUserProfile = exports.DeniedGetUserProfileResponseReason = void 0;
const authUtilities_1 = require("../auth/authUtilities");
var DeniedGetUserProfileResponseReason;
(function (DeniedGetUserProfileResponseReason) {
    DeniedGetUserProfileResponseReason["Blocked"] = "Blocked";
    DeniedGetUserProfileResponseReason["NotFound"] = "User Not Found";
})(DeniedGetUserProfileResponseReason = exports.DeniedGetUserProfileResponseReason || (exports.DeniedGetUserProfileResponseReason = {}));
function handleGetUserProfile({ controller, request, requestBody, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, error } = yield (0, authUtilities_1.checkAuthorization)(controller, request);
        if (error)
            return error;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const user = yield controller.databaseService.tableServices.usersTableService.selectUserByUsername({
            username: requestBody.username,
        });
        const numberOfFollowersOfUserId = yield controller.databaseService.tableServices.userFollowsTableService.countFollowersOfUserId({
            userIdBeingFollowed: userId,
        });
        const numberOfFollowsByUserId = yield controller.databaseService.tableServices.userFollowsTableService.countFollowsOfUserId({
            userIdDoingFollowing: userId,
        });
        const posts = yield controller.databaseService.tableServices.postsTableService.getPostsByCreatorUserId({
            creatorUserId: userId,
        });
        if (!user) {
            controller.setStatus(404);
            return { error: { reason: DeniedGetUserProfileResponseReason.NotFound } };
        }
        return {
            success: {
                username: user.username,
                followers: {
                    count: numberOfFollowersOfUserId,
                },
                subscribers: {
                    count: 0,
                },
                follows: {
                    count: numberOfFollowsByUserId,
                },
                bio: user.short_bio,
                posts: posts.map((post) => {
                    return {
                        imageUrl: post.image_blob_filekey,
                        creatorUsername: user.username,
                        creationTimestamp: 0,
                        caption: post.caption,
                        likes: {
                            count: 0,
                        },
                        comments: {
                            count: 0,
                        },
                        shares: {
                            count: 0,
                        },
                    };
                }),
                shopItems: [],
            },
        };
    });
}
exports.handleGetUserProfile = handleGetUserProfile;
//# sourceMappingURL=handleGetUserProfile.js.map