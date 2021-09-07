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
const models_1 = require("./models");
class UsersTableService extends models_1.TableService {
    constructor(datastorePool) {
        super();
        this.datastorePool = datastorePool;
        this.tableName = UsersTableService.tableName;
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        short_bio VARCHAR(64),
        encrypted_password VARCHAR(64) NOT NULL
      )
      ;
    `;
            yield this.datastorePool.query(queryString);
        });
    }
    createUser({ userId, email, username, encryptedPassword, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        INSERT INTO ${UsersTableService.tableName}(
            id,
            email,
            username,
            encrypted_password
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
    selectUserByUsername({ username, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        SELECT
          *
        FROM
          ${UsersTableService.tableName}
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
    selectUserByUserId({ userId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        SELECT
          *
        FROM
          ${UsersTableService.tableName}
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
UsersTableService.tableName = `${config_1.TABLE_NAME_PREFIX}_users`;
