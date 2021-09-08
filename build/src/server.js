"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
require("reflect-metadata");
const app_1 = require("./app");
const port = process.env.PORT || 4000;
app_1.app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//# sourceMappingURL=server.js.map