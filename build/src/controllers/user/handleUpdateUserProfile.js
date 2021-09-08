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
exports.handleUpdateUserProfile = exports.DefaultPostPrivacySetting = void 0;
const authUtilities_1 = require("../auth/authUtilities");
var DefaultPostPrivacySetting;
(function (DefaultPostPrivacySetting) {
    DefaultPostPrivacySetting["PublicAndGuestCheckout"] = "PublicAndGuestCheckout";
})(DefaultPostPrivacySetting = exports.DefaultPostPrivacySetting || (exports.DefaultPostPrivacySetting = {}));
function handleUpdateUserProfile({ controller, request, requestBody, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, error } = yield (0, authUtilities_1.checkAuthorization)(controller, request);
        if (error)
            return error;
        const user = yield controller.databaseService.tableServices.usersTableService.selectUserByUserId({
            userId,
        });
        return {};
    });
}
exports.handleUpdateUserProfile = handleUpdateUserProfile;
//# sourceMappingURL=handleUpdateUserProfile.js.map