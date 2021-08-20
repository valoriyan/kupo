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
exports.setupTables = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
function setupTables() {
    return __awaiter(this, void 0, void 0, function* () {
        const temporaryPool = new pg_1.Pool({
            database: config_1.DATABASE_NAME,
        });
        yield temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${config_1.DATABASE_TABLE_NAMES.users} (
        id VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        encryptedpassword VARCHAR(64) NOT NULL
      )
      ;
    `);
        yield temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${config_1.DATABASE_TABLE_NAMES.posts} (
        image_id VARCHAR(64) UNIQUE NOT NULL,
        caption VARCHAR(256) NOT NULL,
        image_blob_filekey VARCHAR(128) NOT NULL,
        title VARCHAR(128) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL
      )
      ;
    `);
        yield temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${config_1.DATABASE_TABLE_NAMES.userFollows} (
        user_id_doing_following VARCHAR(64) NOT NULL,
        user_id_being_followed VARCHAR(64) NOT NULL,
        PRIMARY KEY (user_id_doing_following, user_id_being_followed)
      )
      ;
    `);
        yield temporaryPool.end();
    });
}
exports.setupTables = setupTables;
