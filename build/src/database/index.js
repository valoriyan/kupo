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
exports.DatabaseService = void 0;
const pg_1 = require("pg");
class DatabaseService {
    static doesDatabaseExist() {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryPool = new pg_1.Pool();
            const response = yield temporaryPool.query(`
      SELECT datname FROM pg_database
      WHERE datistemplate = false;
    `);
            const databaseExists = response.rows.some((row) => {
                return row.datname === DatabaseService.databaseName;
            });
            yield temporaryPool.end();
            return databaseExists;
        });
    }
    static setupDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseExists = yield DatabaseService.doesDatabaseExist();
            const temporaryPool = new pg_1.Pool();
            if (!databaseExists) {
                yield temporaryPool.query(`
        CREATE DATABASE ${DatabaseService.databaseName};
      `);
            }
            yield temporaryPool.end();
        });
    }
    static setupTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryPool = new pg_1.Pool({
                database: DatabaseService.databaseName,
            });
            yield temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${DatabaseService.tableName} (
        id VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        encryptedpassword VARCHAR(64) NOT NULL
      );
    `);
            yield temporaryPool.end();
        });
    }
    static teardownDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryPool = new pg_1.Pool();
            const queryString = `
      DROP DATABASE IF EXISTS ${DatabaseService.databaseName} WITH (FORCE);
    `;
            try {
                yield temporaryPool.query(queryString);
            }
            catch (error) {
                console.log(error);
            }
            yield temporaryPool.end();
        });
    }
    static teardownTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseExists = yield DatabaseService.doesDatabaseExist();
            if (!databaseExists)
                return;
            const temporaryPool = new pg_1.Pool();
            const queryString = `
      DROP TABLE IF EXISTS ${DatabaseService.tableName};
    `;
            yield temporaryPool.query(queryString);
            yield temporaryPool.end();
        });
    }
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!DatabaseService.datastorePool) {
                DatabaseService.datastorePool = new pg_1.Pool({
                    database: DatabaseService.databaseName,
                });
            }
            return this.datastorePool;
        });
    }
}
exports.DatabaseService = DatabaseService;
DatabaseService.databaseName = process.env.DATABASE_NAME;
DatabaseService.tableName = "playhousedevtable";
