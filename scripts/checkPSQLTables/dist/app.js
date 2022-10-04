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
const dotenv_1 = require("dotenv");
const assertMatchingDatabaseStructures_1 = require("./assertMatchingDatabaseStructures");
const getDatabaseStructure_1 = require("./getDatabaseStructure");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, dotenv_1.config)();
        const localDatabaseConfig = {
            databaseName: process.env.LOCAL_DATABASE_NAME,
            implementedDatabaseServiceType: process.env.LOCAL_IMPLEMENTED_DATABASE_SERVICE_TYPE,
            databaseUrl: process.env.LOCAL_DATABASE_URL,
        };
        const betaDatabaseConfig = {
            databaseName: process.env.BETA_DATABASE_NAME,
            implementedDatabaseServiceType: process.env.BETA_IMPLEMENTED_DATABASE_SERVICE_TYPE,
            databaseUrl: process.env.BETA_DATABASE_URL,
        };
        const localDatabaseStructure = yield (0, getDatabaseStructure_1.getDatabaseStructure)(localDatabaseConfig);
        const betaDatabaseStructure = yield (0, getDatabaseStructure_1.getDatabaseStructure)(betaDatabaseConfig);
        (0, assertMatchingDatabaseStructures_1.assertMatchingDatabaseStructures)(localDatabaseStructure, betaDatabaseStructure);
    });
}
run();
//# sourceMappingURL=app.js.map