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
exports.getDatabasePool = void 0;
const pg_1 = require("pg");
function getDatabasePool(databaseConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const { databaseUrl, databaseName, implementedDatabaseServiceType } = databaseConfig;
        const connection_string = databaseUrl || undefined;
        const ssl = !!connection_string ? { rejectUnauthorized: false } : undefined;
        const database = !!connection_string ? undefined : databaseName;
        let poolConfig;
        if (implementedDatabaseServiceType === "REMOTE_POSTGRES") {
            poolConfig = {
                connectionString: connection_string,
                ssl,
            };
            console.log(`STARTING DATABASE SERVICE @ '${connection_string}' | ${JSON.stringify(ssl)}`);
        }
        else if (implementedDatabaseServiceType === "LOCAL_POSTGRES") {
            poolConfig = {
                database,
            };
            console.log(`STARTING DATABASE SERVICE @ '${database}'`);
        }
        else {
            throw new Error(`Unrecognized IMPLEMENTED_DATABASE_SERVICE_TYPE: "${implementedDatabaseServiceType}"`);
        }
        return new pg_1.Pool(poolConfig);
    });
}
exports.getDatabasePool = getDatabasePool;
//# sourceMappingURL=getDatabasePool.js.map