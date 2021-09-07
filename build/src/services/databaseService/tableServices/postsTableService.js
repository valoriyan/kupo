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
exports.PostsTableService = void 0;
const config_1 = require("../config");
const models_1 = require("./models");
class PostsTableService extends models_1.TableService {
    constructor(datastorePool) {
        super();
        this.datastorePool = datastorePool;
        this.tableName = PostsTableService.tableName;
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        post_id VARCHAR(64) UNIQUE NOT NULL,
        creator_user_id VARCHAR(64) UNIQUE NOT NULL,
        image_id VARCHAR(64) UNIQUE NOT NULL,
        caption VARCHAR(256) NOT NULL,
        image_blob_filekey VARCHAR(128) NOT NULL,
        title VARCHAR(128) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL
      )
      ;
    `;
            yield this.datastorePool.query(queryString);
        });
    }
    createPost({ postId, creatorUserId, imageId, caption, imageBlobFilekey, title, price, scheduledPublicationTimestamp, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        INSERT INTO ${this.tableName}(
            post_id,
            creator_user_id,
            image_id,
            caption,
            image_blob_filekey,
            title,
            price,
            scheduled_publication_timestamp
        )
        VALUES (
            '${postId}',
            '${creatorUserId}',
            '${imageId}',
            '${caption}',
            '${imageBlobFilekey}',
            '${title}',
            '${price}',
            '${scheduledPublicationTimestamp}'
        )
        ;
        `;
            yield this.datastorePool.query(queryString);
        });
    }
    getPostsByCreatorUserId({ creatorUserId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        SELECT
          *
        FROM
          ${PostsTableService.tableName}
        WHERE
          creator_user_id = '${creatorUserId}'
        LIMIT
          1
        ;
      `;
            const response = yield this.datastorePool.query(queryString);
            const rows = response.rows;
            return rows;
        });
    }
}
exports.PostsTableService = PostsTableService;
PostsTableService.tableName = `${config_1.TABLE_NAME_PREFIX}_posts`;
