import { app } from "./app";

import { config as injectEnvironmentVariables } from "dotenv";

injectEnvironmentVariables();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
