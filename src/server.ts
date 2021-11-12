import { config as injectEnvironmentVariables } from "dotenv";
import { createServer } from "http";
injectEnvironmentVariables();

import "reflect-metadata";

import { app } from "./app";
import { WebSocketService } from "./services/webSocketService";

const port = process.env.PORT || 4000;

const httpServer = createServer(app);

new WebSocketService(httpServer);

httpServer.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
