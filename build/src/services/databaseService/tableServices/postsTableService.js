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
class PostsTableService {
    constructor(datastorePool) {
        this.datastorePool = datastorePool;
    }
    createPost({ imageId, caption, imageBlobFilekey, title, price, scheduledPublicationTimestamp, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `
        INSERT INTO ${config_1.DATABASE_TABLE_NAMES.posts}(
            image_id,
            caption,
            image_blob_filekey,
            title,
            price,
            scheduled_publication_timestamp
        )
        VALUES (
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
}
exports.PostsTableService = PostsTableService;
