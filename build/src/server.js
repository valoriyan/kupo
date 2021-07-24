"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const port = process.env.PORT || 3000;
app_1.app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
