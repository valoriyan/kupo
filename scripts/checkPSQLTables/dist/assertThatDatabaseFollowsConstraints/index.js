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
exports.assertThatDatabaseFollowsConstraints = void 0;
const getDatabasePool_1 = require("../getDatabasePool");
const bluebird_1 = require("bluebird");
const assertForeignKeyConstraints_1 = require("./assertForeignKeyConstraints");
function assertThatDatabaseFollowsConstraints({ databaseConfig, databaseStructure, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield (0, getDatabasePool_1.getDatabasePool)(databaseConfig);
        const tableNames = Object.keys(databaseStructure);
        yield bluebird_1.Promise.each(tableNames, (tableName, index) => __awaiter(this, void 0, void 0, function* () {
            // if (tableName !== "post_content_elements") {
            //   return;
            // }
            console.log(`tableName: "${tableName}"`);
            const tableStructure = databaseStructure[tableName];
            const tableConstaints = tableStructure.constraints;
            yield (0, assertForeignKeyConstraints_1.assertForeignKeyConstraint)({
                pool,
                tableConstaints,
                tableName,
            });
        }));
    });
}
exports.assertThatDatabaseFollowsConstraints = assertThatDatabaseFollowsConstraints;
//# sourceMappingURL=index.js.map