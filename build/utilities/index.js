"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentVariable = void 0;
function getEnvironmentVariable(name) {
    if (!!process.env[name]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return process.env[name];
    }
    else {
        throw `Missing ${name} environment variable`;
    }
}
exports.getEnvironmentVariable = getEnvironmentVariable;
