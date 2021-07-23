import { MD5 } from "crypto-js";
import { Pool, QueryResult } from "pg";
import { DatastoreService } from "src/datastore";
import {
  Body,
    Controller,
    Post,
    Route,
  } from "tsoa";
  

interface RegisterUserParams {
  email: string;
  password: string;
  username: string;
}

interface LoginUserParams {
  email: string;
  password: string;
}

interface SuccessfulAuthResponse {
  accessToken: string;
  refreshToken: string;
}

const salt = "";

@Route("auth")
export class AuthController extends Controller {
    @Post("register")
    public async registerUser(
      @Body() requestBody: RegisterUserParams,
    ): Promise<SuccessfulAuthResponse> {
        this.setStatus(201);

        const datastorePool: Pool = DatastoreService.get();

        const encryptedPassword = MD5(salt + requestBody.password).toString();

        const response: QueryResult<{datname: string}> = await datastorePool.query(`
        INSERT INTO playhouseDev(email, username, encryptedPassword)
        VALUES (${requestBody.email}, ${requestBody.username}, ${encryptedPassword})
    `);

        console.log(response);
        return {
          accessToken: "string",
          refreshToken: "string",
        };
    }

    @Post("login")
    public async loginUser(
      @Body() requestBody: LoginUserParams,
    ): Promise<SuccessfulAuthResponse> {
        this.setStatus(200);

        const datastorePool: Pool = DatastoreService.get();

        const response: QueryResult<{datname: string}> = await datastorePool.query(`
        INSERT INTO playhouseDev(email, username, encryptedPassword)
        VALUES (${requestBody.email}, ${requestBody.username}, ${encryptedPassword})
    `);

        console.log(response);


        console.log(requestBody);

        return {
          accessToken: "string",
          refreshToken: "string",
        };
    }
  }
  