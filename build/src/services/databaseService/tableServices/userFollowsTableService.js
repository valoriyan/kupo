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
exports.UserFollowsTableService = void 0;
const config_1 = require("../config");
const models_1 = require("./models");
class UserFollowsTableService extends models_1.TableService {
    constructor(datastorePool) {
        super();
        this.datastorePool = datastorePool;
        this.tableName = UserFollowsTableService.tableName;
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        user_id_doing_following VARCHAR(64) NOT NULL,
        user_id_being_followed VARCHAR(64) NOT NULL,
        PRIMARY KEY (user_id_doing_following, user_id_being_followed)
      )
      ;
    `;
            yield this.datastorePool.query(queryString);
        });
    }
    createUserFollow({ userIdDoingFollowing, userIdBeingFollowed, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        INSERT INTO ${UserFollowsTableService.tableName}(
            user_id_doing_following,
            user_id_being_followed,
        )
        VALUES (
            '${userIdDoingFollowing}',
            '${userIdBeingFollowed}'
        )
        ;
        `;
            yield this.datastorePool.query(queryString);
        });
    }
    countFollowersOfUserId({ userIdBeingFollowed, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        SELECT
          COUNT(*)
        FROM
          ${UserFollowsTableService.tableName}
        WHERE
          user_id_being_followed = '${userIdBeingFollowed}'
        ;
      `;
            const response = yield this.datastorePool.query(queryString);
            return response.rows[0].count;
        });
    }
    countFollowsOfUserId({ userIdDoingFollowing, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        SELECT
          COUNT(*)
        FROM
          ${UserFollowsTableService.tableName}
        WHERE
          user_id_doing_following = '${userIdDoingFollowing}'
        ;
      `;
            const response = yield this.datastorePool.query(queryString);
            return response.rows[0].count;
        });
    }
}
exports.UserFollowsTableService = UserFollowsTableService;
UserFollowsTableService.tableName = `${config_1.TABLE_NAME_PREFIX}_user_follows`;
//# sourceMappingURL=userFollowsTableService.js.map