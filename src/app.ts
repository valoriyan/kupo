import "reflect-metadata";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import { DatabaseService } from "./services/databaseService";

export const app = express();

const origin = process.env.CORS_ORIGIN || "http://localhost:3000";
console.log(`ORIGIN: ${origin}`);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(cookieParser());
app.use(cors({ origin, credentials: true }));

app.use("/docs", swaggerUi.serve, async (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import("../build/swagger.json")));
});

app.use("/open-api-spec", async (req: Request, res: Response) => {
  return res.json((await import("../build/swagger.json")).default);
});

RegisterRoutes(app);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: express.Request, res: express.Response) => {
  const status = err.status || 500;
  const body = {
    fields: err.fields || undefined,
    message: err.message || "An error occurred during the request.",
    name: err.name,
    status,
  };

  if (res.status) {
    res.status(status).json(body);
  } else {
    // `res` is next function in some cases
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res as any)();
  }
});

// TODO: REMOVE WHEN ADDING CLOUD STORAGE
app.use("/tmp", express.static("tmp"));

app.get("/", (_, res) => {
  res.send("Hello World!");
});

DatabaseService.start();
