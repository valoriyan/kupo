import request from "supertest";
import { app } from "../src/app";
import { DatabaseService } from "../src/database";

jest.setTimeout(100000);

describe("GET /random-url", () => {
  it("should return 404", (done) => {
    request(app).get("/reset").expect(404, done);
  });
});

describe("REGISTER /auth/register", () => {
  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await DatabaseService.teardownDatabase();

    await DatabaseService.setupDatabase();
    await DatabaseService.setupTable();
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await DatabaseService.teardownDatabase();
  });

  it("registers and remembers user", () => {
    async function callback() {
      await request(app)
        .post("/auth/register")
        .send({
          email: "bob@gmail.com",
          password: "BobBobson!",
          username: "bobward",
        })
        .expect(201);

      await request(app)
        .post("/auth/login")
        .send({
          email: "bob@gmail.com",
          password: "BobBobson!",
        })
        .expect(200);
    }

    return callback();
  });

  it("registers and attempts missing user", () => {
    async function callback() {
      await request(app)
        .post("/auth/register")
        .send({
          email: "bob@gmail.com",
          password: "BobBobson!",
          username: "bobward",
        })
        .expect(201);

      await request(app)
        .post("/auth/login")
        .send({
          email: "unknownemail@gmail.com",
          password: "BobBobson!",
        })
        .expect(401);
    }

    return callback();
  });

  it("registers and attempts wrong password", () => {
    async function callback() {
      await request(app)
        .post("/auth/register")
        .send({
          email: "bob@gmail.com",
          password: "BobBobson!",
          username: "bobward",
        })
        .expect(201);

      await request(app)
        .post("/auth/login")
        .send({
          email: "bob@gmail.com",
          password: "wrongpassword!",
        })
        .expect(401, {
          error: {
            reason: "Wrong Password",
          },
        });
    }

    return callback();
  });
});
