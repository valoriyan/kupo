import { MD5 } from "crypto-js";
import { Pool, QueryResult } from "pg";
import { DatabaseService } from "../database";
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

function encryptPassword({
  password,
}: {
  password: string;
}): string {
  return MD5(salt + password).toString()
}

@Route("auth")
export class AuthController extends Controller {
    @Post("register")
    public async registerUser(
      @Body() requestBody: RegisterUserParams,
    ): Promise<SuccessfulAuthResponse> {
      this.setStatus(201);

      const datastorePool: Pool = await DatabaseService.get();

      const encryptedPassword = encryptPassword({password: requestBody.password});

      const queryString = `
        INSERT INTO playhousedevtable(email, username, encryptedpassword)
        VALUES ('${requestBody.email}', '${requestBody.username}', '${encryptedPassword}')
        ;
      `;

      try {
        const response: QueryResult<{datname: string}> = await datastorePool.query(queryString);
        console.log(response);
      } catch (error) {
        console.log("error", error);
      }

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

        const datastorePool: Pool = await DatabaseService.get();

        try {
          const queryString = `
            SELECT
              *
            FROM
              playhousedevtable
            WHERE
              email = '${requestBody.email}';
          `;

          const response: QueryResult<{
            email: string;
            username: string;
            encryptedpassword: string;
          }> = await datastorePool.query(queryString);

          const rows = response.rows;

          if (rows.length === 1) {
            const row = rows[0];
            const hasMatchedPassword = encryptPassword({password: requestBody.password}) === row.encryptedpassword;
          }

          console.log(response);
        } catch (error) {
          console.log("error", error);
        }
  
        console.log(requestBody);

        return {
          accessToken: "string",
          refreshToken: "string",
        };
    }
  }
  