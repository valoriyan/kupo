import request from "supertest";
import { app } from "../src/app";
import { DatabaseService } from "../src/database";

jest.setTimeout(100000);

describe("GET /random-url", () => {
    it("should return 404", (done) => {
        request(app)
            .get("/reset")
            .expect(404, done);
    });
});

describe("REGISTER /auth/register", () => {
    beforeAll(() => {
        async function callback() {
            await DatabaseService.teardownDatabase();
    
            await DatabaseService.setupDatabase();
            await DatabaseService.setupTable();
        }
        return callback();
      });
      
      afterAll(() => {
        async function callback() {
            // await new Promise(resolve => setTimeout(resolve, 5000));
            await DatabaseService.teardownDatabase();
            console.log("FINISHED!");
        }
        return callback();
      });
      

    it("should return 201", () => {
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
});
