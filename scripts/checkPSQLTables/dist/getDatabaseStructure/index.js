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
exports.getDatabaseStructure = void 0;
const getStructureOfTableColumns_1 = require("./getStructureOfTableColumns");
const getDatabasePool_1 = require("../getDatabasePool");
const bluebird_1 = require("bluebird");
const getTableNames_1 = require("./getTableNames");
const getTableConstraints_1 = require("./getTableConstraints");
function getDatabaseStructure(databaseConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield (0, getDatabasePool_1.getDatabasePool)(databaseConfig);
        const databaseStructure = {};
        const tableNames = yield (0, getTableNames_1.getTableNames)({ pool });
        yield bluebird_1.Promise.each(tableNames, (tableName) => __awaiter(this, void 0, void 0, function* () {
            const tableStructure = yield getTableStructure({
                tableName,
                pool,
            });
            databaseStructure[tableName] = tableStructure;
        }));
        return databaseStructure;
    });
}
exports.getDatabaseStructure = getDatabaseStructure;
function getTableStructure({ tableName, pool, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const columnStructures = yield (0, getStructureOfTableColumns_1.getStructureOfTableColumns)({
            pool,
            tableName,
        });
        const tableConstraints = yield (0, getTableConstraints_1.getTableConstraints)({
            tableName,
            pool,
        });
        return {
            columns: columnStructures,
            constraints: tableConstraints,
        };
    });
}
//# sourceMappingURL=index.js.map