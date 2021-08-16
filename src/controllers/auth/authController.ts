import { MD5 } from "crypto-js";
import express from "express";
import { DateTime } from "luxon";
import { Pool, QueryResult } from "pg";
import { DatabaseService } from "../../database";
import { Body, Controller, Get, Post, Request, Route } from "tsoa";
import {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_EXPIRATION_TIME,
  validateTokenAndGetUserId,
} from "../../utilities/authUtilities";
import { v4 as uuidv4 } from "uuid";
import { HTTPResponse } from "../../types/httpResponse";
import { LocalEmailService } from "src/services/emailService";
import { injectable } from "tsyringe";

interface RegisterUserParams {
  email: string;
  password: string;
  username: string;
}

interface LoginUserParams {
  username: string;
  password: string;
}

interface RequestPasswordResetParams {
  email: string;
}

interface SuccessfulAuthResponse {
  accessToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SuccessfulPasswordResetResponse {}

export enum AuthFailureReason {
  WrongPassword = "Wrong Password",
  UnknownCause = "Unknown Cause",
  NoRefreshToken = "No Refresh Token Found",
  InvalidToken = "Failed To Validate Token",
  TokenGenerationFailed = "Failed To Generate Access Token",
  AuthorizationError = "You Must Be Logged In",
}

export interface FailedAuthResponse {
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

@injectable()
@Route("auth")
export class AuthController extends Controller {
  constructor(private localEmailService: LocalEmailService) {
    super();
  }

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

      const accessToken = generateAccessToken({
        userId,
        jwtPrivateKey: process.env.JWT_PRIVATE_KEY as string,
      });
      const refreshToken = generateRefreshToken({
        userId,
        jwtPrivateKey: process.env.JWT_PRIVATE_KEY as string,
      });

      const tokenExpirationTime = DateTime.now()
        .plus(REFRESH_TOKEN_EXPIRATION_TIME)
        .toJSDate()
        .toUTCString();

      this.setHeader(
        "Set-Cookie",
        `refreshToken=${refreshToken}; HttpOnly; Secure; Expires=${tokenExpirationTime}`,
      );

      this.setStatus(201);
      return { success: { accessToken } };
    } catch (error) {
      console.log("error", error);
      this.setStatus(401);
      return { error: { reason: AuthFailureReason.UnknownCause } };
    }
  }

  @Post("login")
  public async loginUser(
    @Body() requestBody: LoginUserParams,
  ): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
    const { username, password } = requestBody;
    const jwtPrivateKey = process.env.JWT_PRIVATE_KEY as string;

    const datastorePool: Pool = await DatabaseService.get();

    try {
      const queryString = `
        SELECT
          *
        FROM
          playhousedevtable
        WHERE
          username = '${username}';
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
          return grantNewAccessToken(this, userId, jwtPrivateKey);
        }
      }

      this.setStatus(401);
      return { error: { reason: AuthFailureReason.WrongPassword } };
    } catch (error) {
      console.log("error", error);
      this.setStatus(401);
      return { error: { reason: AuthFailureReason.UnknownCause } };
    }
  }

  @Get("refresh-access-token")
  public async refreshAccessToken(
    @Request() request: express.Request,
  ): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
    const refreshToken = request.cookies.refreshToken as string | undefined;
    const jwtPrivateKey = process.env.JWT_PRIVATE_KEY as string;

    if (!refreshToken) {
      this.setStatus(401);
      return { error: { reason: AuthFailureReason.NoRefreshToken } };
    }

    let userId: string;

    try {
      userId = validateTokenAndGetUserId({
        token: refreshToken,
        jwtPrivateKey,
      });
    } catch {
      this.setStatus(401);
      return { error: { reason: AuthFailureReason.InvalidToken } };
    }

    try {
      return grantNewAccessToken(this, userId, jwtPrivateKey);
    } catch {
      this.setStatus(401);
      return { error: { reason: AuthFailureReason.TokenGenerationFailed } };
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

  @Get("logout")
  public async logout(): Promise<void> {
    this.setHeader(
      "Set-Cookie",
      `refreshToken=deleted; HttpOnly; Secure; Expires=${new Date(0).toUTCString()};`,
    );

    this.setStatus(200);
  }
}

const grantNewAccessToken = (
  controller: Controller,
  userId: string,
  jwtPrivateKey: string,
) => {
  const accessToken = generateAccessToken({
    userId,
    jwtPrivateKey,
  });
  const refreshToken = generateRefreshToken({
    userId,
    jwtPrivateKey,
  });

  const tokenExpirationTime = DateTime.now()
    .plus(REFRESH_TOKEN_EXPIRATION_TIME)
    .toJSDate()
    .toUTCString();

  controller.setHeader(
    "Set-Cookie",
    `refreshToken=${refreshToken}; HttpOnly; Secure; Expires=${tokenExpirationTime}`,
  );

  controller.setStatus(200);
  return { success: { accessToken } };
};
