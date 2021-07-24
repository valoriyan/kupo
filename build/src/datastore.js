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
exports.tearDownTestDatabase = exports.initializeTestDatabase = exports.createUser = exports.getDB = exports.DatastoreService = void 0;
const pg_1 = require("pg");
class DatastoreService {
    static get() {
        var _a;
        return (_a = this.datastorePool) !== null && _a !== void 0 ? _a : new pg_1.Pool();
    }
}
exports.DatastoreService = DatastoreService;
DatastoreService.hasBeenInitialized = false;
const getDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool();
    const databaseName = "playhouseDev";
    yield exports.initializeTestDatabase({ pool, databaseName });
    // await tearDownTestDatabase({pool, databaseName});
});
exports.getDB = getDB;
const createUser = () => __awaiter(void 0, void 0, void 0, function* () {
    return;
});
exports.createUser = createUser;
const initializeTestDatabase = ({ pool, databaseName }) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield pool.query(`
        SELECT datname FROM pg_database
        WHERE datistemplate = false;    
    `);
    const databaseExists = response.rows.every((row) => {
        return row.datname !== databaseName;
    });
    if (!databaseExists) {
        yield pool.query(`
            CREATE DATABASE ${databaseName};
        `);
    }
    return;
});
exports.initializeTestDatabase = initializeTestDatabase;
const tearDownTestDatabase = ({ pool, databaseName }) => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.query(`
            DROP DATABASE IF EXISTS ${databaseName};
        `);
    return;
});
exports.tearDownTestDatabase = tearDownTestDatabase;
