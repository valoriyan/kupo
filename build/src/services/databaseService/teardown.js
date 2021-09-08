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
exports.teardownDatabaseServive = void 0;
// import { Promise as BluebirdPromise } from "bluebird";
const pg_1 = require("pg");
const config_1 = require("./config");
// async function teardownTables({
//   tableServices,
// }: {
//   tableServices: { [key: string]: TableService };
// }): Promise<void> {
//   BluebirdPromise.each(Object.values(tableServices), async (tableService) => {
//     await tableService.teardown();
//   });
// }
function teardownDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const datastorePool = new pg_1.Pool({});
        yield datastorePool.query(`
    DROP DATABASE IF EXISTS ${config_1.DATABASE_NAME} WITH (FORCE);
  `);
        yield datastorePool.end();
    });
}
function teardownDatabaseServive() {
    return __awaiter(this, void 0, void 0, function* () {
        // await teardownTables({tableServices});
        yield teardownDatabase();
    });
}
exports.teardownDatabaseServive = teardownDatabaseServive;
//# sourceMappingURL=teardown.js.map