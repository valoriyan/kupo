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
exports.UsersTableService = void 0;
const config_1 = require("../config");
class UsersTableService {
    constructor(datastorePool) {
        this.datastorePool = datastorePool;
    }
    createUser({ userId, email, username, encryptedPassword, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        INSERT INTO ${config_1.DATABASE_TABLE_NAMES.users}(
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
            yield this.datastorePool.query(queryString);
        });
    }
    selectUserByUsername({ username }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        SELECT
          *
        FROM
          ${config_1.DATABASE_TABLE_NAMES.users}
        WHERE
          username = '${username}'
        LIMIT
          1
        ;
      `;
            const response = yield this.datastorePool.query(queryString);
            const rows = response.rows;
            return rows[0];
        });
    }
    selectUserByUserId({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        SELECT
          *
        FROM
          ${config_1.DATABASE_TABLE_NAMES.users}
        WHERE
          id = '${userId}'
        LIMIT
          1
        ;
      `;
            const response = yield this.datastorePool.query(queryString);
            const rows = response.rows;
            return rows[0];
        });
    }
}
exports.UsersTableService = UsersTableService;
