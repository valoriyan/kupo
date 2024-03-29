import { config as injectEnvironmentVariables } from "dotenv";
import { createServer } from "http";
injectEnvironmentVariables();

import "reflect-metadata";

import { app } from "./app";
import { WebSocketService } from "./services/webSocketService";
import { getEnvironmentVariable } from "./utilities";

const port = getEnvironmentVariable("PORT", "4000");

const httpServer = createServer(app);

WebSocketService.start(httpServer);

httpServer.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);
