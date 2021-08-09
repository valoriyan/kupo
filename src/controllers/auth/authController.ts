import { MD5 } from "crypto-js";
import { Pool, QueryResult } from "pg";
import { DatabaseService } from "../../database";
import { Body, Controller, Post, Route } from "tsoa";
import { generateAccessToken, generateRefreshToken } from "../../utilities/authUtilities";
import { v4 as uuidv4 } from "uuid";
import { HTTPResponse } from "../../types/httpResponse";

interface RegisterUserParams {
  email: string;
  password: string;
  username: string;
}

interface LoginUserParams {
  email: string;
  password: string;
}

interface RequestPasswordResetParams {
  email: string;
}

interface SuccessfulAuthResponse {
  accessToken: string;
  refreshToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SuccessfulPasswordResetResponse {}

enum AuthFailureReason {
  WrongPassword = "Wrong Password",
  UnknownCause = "Unknown Cause",
}
interface FailedAuthResponse {
  reason: AuthFailureReason;
}

enum DeniedPasswordResetResponseReason {
  TooManyAttempts = "Too Many Attempts",
}

interface DeniedPasswordResetResponse {
  reason: DeniedPasswordResetResponseReason;
}

function encryptPassword({ password }: { password: string }): string {
  const salt = process.env.SALT;
  return MD5(salt + password).toString();
}

@Route("auth")
export class AuthController extends Controller {
  @Post("register")
  public async registerUser(
    @Body() requestBody: RegisterUserParams,
  ): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
    const userId = uuidv4();
    const { email, username, password } = requestBody;

    const datastorePool: Pool = await DatabaseService.get();

    const encryptedPassword = encryptPassword({ password });

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
        success: {
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
        error: {
          reason: AuthFailureReason.UnknownCause,
        },
      };
    }
  }

  @Post("login")
  public async loginUser(
    @Body() requestBody: LoginUserParams,
  ): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
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
        const hasMatchedPassword =
          encryptPassword({ password }) === row.encryptedpassword;
        if (hasMatchedPassword) {
          const userId = row.id;

          this.setStatus(200);
          return {
            success: {
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
        error: {
          reason: AuthFailureReason.WrongPassword,
        },
      };
    } catch (error) {
      console.log("error", error);

      this.setStatus(401);
      return {
        error: {
          reason: AuthFailureReason.UnknownCause,
        },
      };
    }
  }

  @Post("resetPassword")
  public async requestPasswordReset(
    @Body() requestBody: RequestPasswordResetParams,
  ): Promise<HTTPResponse<DeniedPasswordResetResponse, SuccessfulPasswordResetResponse>> {
    console.log(requestBody);
    return {
      success: {},
    };
  }
}
