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
exports.setupDatabaseService = void 0;
const bluebird_1 = require("bluebird");
const pg_1 = require("pg");
const config_1 = require("./config");
function doesDatabaseExist({ datastorePool, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield datastorePool.query(`
    SELECT datname FROM pg_database
    WHERE datistemplate = false;
  `);
        const databaseExists = response.rows.some((row) => {
            return row.datname === config_1.DATABASE_NAME;
        });
        return databaseExists;
    });
}
function setupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const datastorePool = new pg_1.Pool({});
        const databaseExists = yield doesDatabaseExist({ datastorePool });
        if (!databaseExists) {
            yield datastorePool.query(`
      CREATE DATABASE ${config_1.DATABASE_NAME};
    `);
        }
        yield datastorePool.end();
    });
}
function setupTables({ tableServices, }) {
    return __awaiter(this, void 0, void 0, function* () {
        bluebird_1.Promise.each(Object.values(tableServices), (tableService) => __awaiter(this, void 0, void 0, function* () {
            yield tableService.setup();
        }));
    });
}
function setupDatabaseService({ tableServices, }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setupDatabase();
        yield setupTables({ tableServices });
    });
}
exports.setupDatabaseService = setupDatabaseService;
//# sourceMappingURL=setup.js.map