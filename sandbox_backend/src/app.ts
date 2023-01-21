import express from "express";

export const app = express();

// https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
app.set("trust proxy", true);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" })); // To parse the incoming requests with JSON payloads

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
  console.log("Receiving Request!");
  res.send("Hello World!");
});
