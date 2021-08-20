"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const pg_1 = require("pg");
const tsyringe_1 = require("tsyringe");
const config_1 = require("./config");
const setupTables_1 = require("./setupTables");
const postsTableService_1 = require("./tableServices/postsTableService");
const userFollowsTableService_1 = require("./tableServices/userFollowsTableService");
const usersTableService_1 = require("./tableServices/usersTableService");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor() {
        this.usersTableService = new usersTableService_1.UsersTableService(DatabaseService_1.datastorePool);
        this.postsTableService = new postsTableService_1.PostsTableService(DatabaseService_1.datastorePool);
        this.userFollowsTableService = new userFollowsTableService_1.UserFollowsTableService(DatabaseService_1.datastorePool);
    }
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("STARTING DATABASE SERVICE");
            DatabaseService_1.datastorePool = new pg_1.Pool({
                database: config_1.DATABASE_NAME,
            });
        });
    }
    static doesDatabaseExist() {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryPool = new pg_1.Pool();
            const response = yield temporaryPool.query(`
      SELECT datname FROM pg_database
      WHERE datistemplate = false;
    `);
            const databaseExists = response.rows.some((row) => {
                return row.datname === config_1.DATABASE_NAME;
            });
            yield temporaryPool.end();
            return databaseExists;
        });
    }
    static setupDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseExists = yield DatabaseService_1.doesDatabaseExist();
            const temporaryPool = new pg_1.Pool();
            if (!databaseExists) {
                yield temporaryPool.query(`
        CREATE DATABASE ${config_1.DATABASE_NAME};
      `);
            }
            yield temporaryPool.end();
        });
    }
    static setupTables() {
        return __awaiter(this, void 0, void 0, function* () {
            yield setupTables_1.setupTables();
        });
    }
    static teardownDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryPool = new pg_1.Pool();
            const queryString = `
      DROP DATABASE IF EXISTS ${config_1.DATABASE_NAME} WITH (FORCE);
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
    static teardownTables() {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseExists = yield DatabaseService_1.doesDatabaseExist();
            if (!databaseExists)
                return;
            const temporaryPool = new pg_1.Pool();
            const queryString = `
      DROP TABLE IF EXISTS ${config_1.DATABASE_TABLE_NAMES.users};
    `;
            yield temporaryPool.query(queryString);
            yield temporaryPool.end();
        });
    }
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!DatabaseService_1.datastorePool) {
                DatabaseService_1.datastorePool = new pg_1.Pool({
                    database: config_1.DATABASE_NAME,
                });
            }
            return this.datastorePool;
        });
    }
};
DatabaseService = DatabaseService_1 = __decorate([
    tsyringe_1.singleton()
], DatabaseService);
exports.DatabaseService = DatabaseService;
DatabaseService.get();
