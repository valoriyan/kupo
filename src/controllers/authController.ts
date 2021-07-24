import { MD5 } from "crypto-js";
import { Pool, QueryResult } from "pg";
import { DatabaseService } from "../database";
import {
  Body,
    Controller,
    Post,
    Route,
  } from "tsoa";
import { generateAccessToken, generateRefreshToken } from "../utilities/authUtilities";
import { v4 as uuidv4 } from "uuid";
import { Either } from "../types/either";


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

enum AuthFailureReason {
  WrongPassword = "Wrong Password",
  UnknownCause = "Unknown Cause",
}
interface FailedAuthResponse {
  reason: AuthFailureReason;
}

function encryptPassword({
  password,
}: {
  password: string;
}): string {
  const salt = process.env.SALT;
  return MD5(salt + password).toString();
}

@Route("auth")
export class AuthController extends Controller {
    @Post("register")
    public async registerUser(
      @Body() requestBody: RegisterUserParams,
    ): Promise<Either<FailedAuthResponse, SuccessfulAuthResponse>> {
      const userId = uuidv4();
      const { email, username, password } = requestBody;

      const datastorePool: Pool = await DatabaseService.get();

      const encryptedPassword = encryptPassword({password});

      const queryString = `
        INSERT INTO playhousedevtable(
          id,
          email,
          username,
          encryptedpassword
        )
        VALUES (
          '${userId}',
          '${email}',
          '${username}',
          '${encryptedPassword}'
        )
        ;
      `;

      try {
        await datastorePool.query(queryString);
        this.setStatus(201);
        return {
          right: {
            accessToken: generateAccessToken({
              userId,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              jwtPrivateKey: process.env.JWT_PRIVATE_KEY!,
            }),
            refreshToken: generateRefreshToken({
              userId,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              jwtPrivateKey: process.env.JWT_PRIVATE_KEY!,
            }),
  
          },
        };  
      } catch (error) {
        console.log("error", error);
        this.setStatus(401);
        return {
          left: {
            reason: AuthFailureReason.UnknownCause,
          },
        };
      }

    }

    @Post("login")
    public async loginUser(
      @Body() requestBody: LoginUserParams,
    ): Promise<Either<FailedAuthResponse, SuccessfulAuthResponse>> {
        const { email, password } = requestBody;

        const datastorePool: Pool = await DatabaseService.get();

        try {
          const queryString = `
            SELECT
              *
            FROM
              playhousedevtable
            WHERE
              email = '${email}';
          `;

          const response: QueryResult<{
            id: string;
            email: string;
            username: string;
            encryptedpassword: string;
          }> = await datastorePool.query(queryString);

          const rows = response.rows;

          if (rows.length === 1) {
            const row = rows[0];
            const hasMatchedPassword = encryptPassword({password}) === row.encryptedpassword;
            if (hasMatchedPassword) {
              const userId = row.id;
              
              this.setStatus(200);
              return {
                right: {
                  accessToken: generateAccessToken({
                    userId,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    jwtPrivateKey: process.env.JWT_PRIVATE_KEY!,
                  }),
                  refreshToken: generateRefreshToken({
                    userId,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    jwtPrivateKey: process.env.JWT_PRIVATE_KEY!,
                  }),
                },
              };
            }
          }
          
          this.setStatus(401);
          return {
            left: {
              reason: AuthFailureReason.WrongPassword,
            },
          };  


        } catch (error) {
          console.log("error", error);

          this.setStatus(401);
          return {
            left: {
              reason: AuthFailureReason.UnknownCause,
            },
          };  
        }  
    }
  }
  