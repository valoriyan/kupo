import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

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
  res.status(status).json(body);
});
