"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iocContainer = void 0;
const tsyringe_1 = require("tsyringe");
exports.iocContainer = {
    get: (controller) => {
        return tsyringe_1.container.resolve(controller);
    },
};
//# sourceMappingURL=inversionOfControl.js.map