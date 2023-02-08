require('newrelic');

import { createServer } from "http";

import { app } from "./app";

const port = process.env.PORT || "4000";

const httpServer = createServer(app);

httpServer.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);
