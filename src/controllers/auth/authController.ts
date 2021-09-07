import express from "express";
import { DateTime } from "luxon";
import { DatabaseService } from "../../services/databaseService";
import { Body, Controller, Get, Post, Request, Route } from "tsoa";
import {
  encryptPassword,
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_EXPIRATION_TIME,
  validateTokenAndGetUserId,
} from "./authUtilities";
import { v4 as uuidv4 } from "uuid";
import { HTTPResponse } from "../../types/httpResponse";
import { LocalEmailService } from "../../services/emailService";
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

@injectable()
@Route("auth")
export class AuthController extends Controller {
  constructor(
    private localEmailService: LocalEmailService,
    private databaseService: DatabaseService,
  ) {
    super();
  }

  @Post("register")
  public async registerUser(
    @Body() requestBody: RegisterUserParams,
  ): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
    const userId = uuidv4();
    const { email, username, password } = requestBody;

    const encryptedPassword = encryptPassword({ password });

    try {
      this.databaseService.tableServices.usersTableService.createUser({
        userId,
        email,
        username,
        encryptedPassword,
      });

      return grantNewAccessToken({
        controller: this,
        userId,
        jwtPrivateKey: process.env.JWT_PRIVATE_KEY as string,
        successStatusCode: 201,
      });
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

    try {
      const user =
        await this.databaseService.tableServices.usersTableService.selectUserByUsername({
          username,
        });
      if (user) {
        const hasMatchedPassword =
          encryptPassword({ password }) === user.encrypted_password;
        if (hasMatchedPassword) {
          const userId = user.id;
          return grantNewAccessToken({ controller: this, userId, jwtPrivateKey });
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
      return grantNewAccessToken({ controller: this, userId, jwtPrivateKey });
    } catch {
      this.setStatus(401);
      return { error: { reason: AuthFailureReason.TokenGenerationFailed } };
    }
  }

  @Post("resetPassword")
  public async requestPasswordReset(
    @Body() requestBody: RequestPasswordResetParams,
  ): Promise<HTTPResponse<DeniedPasswordResetResponse, SuccessfulPasswordResetResponse>> {
    this.localEmailService.sendResetPasswordEmail({ userId: requestBody.email });
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

function grantNewAccessToken({
  controller,
  userId,
  jwtPrivateKey,
  successStatusCode = 200,
}: {
  controller: Controller;
  userId: string;
  jwtPrivateKey: string;
  successStatusCode?: number;
}): HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse> {
  const accessToken = generateAccessToken({
    userId,
    jwtPrivateKey,
  });
  const refreshToken = generateRefreshToken({
    userId,
    jwtPrivateKey,
  });

  const tokenExpirationTime = DateTime.now()
    .plus(REFRESH_TOKEN_EXPIRATION_TIME * 1000)
    .toJSDate()
    .toUTCString();

  controller.setHeader(
    "Set-Cookie",
    `refreshToken=${refreshToken}; HttpOnly; Secure; Expires=${tokenExpirationTime}`,
  );

  controller.setStatus(successStatusCode);
  return { success: { accessToken } };
}
