import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/docs", swaggerUi.serve, async (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import("../build/swagger.json")));
});

app.use("/open-api-spec", async (req: Request, res: Response) => {
  return res.json((await import("../build/swagger.json")).default);
});

RegisterRoutes(app);
