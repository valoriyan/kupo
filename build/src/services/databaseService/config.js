"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_TABLE_NAMES = exports.TABLE_NAME_PREFIX = exports.DATABASE_NAME = void 0;
exports.DATABASE_NAME = process.env.DATABASE_NAME;
exports.TABLE_NAME_PREFIX = "playhouse";
exports.DATABASE_TABLE_NAMES = {
    "users": `${exports.TABLE_NAME_PREFIX}_users`,
    "posts": `${exports.TABLE_NAME_PREFIX}_posts`,
    "userFollows": `${exports.TABLE_NAME_PREFIX}_user_follows`,
};
