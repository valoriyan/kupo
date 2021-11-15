import express from "express";
import { DatabaseService } from "../../services/databaseService";
import { Body, Controller, Get, Post, Request, Route } from "tsoa";
import { encryptPassword, validateTokenAndGetUserId } from "./utilities";
import { HTTPResponse, SecuredHTTPResponse } from "../../types/httpResponse";
import { LocalEmailService } from "../../services/emailService";
import { injectable } from "tsyringe";
import { grantNewAccessToken } from "./utilities/grantNewAccessToken";
import { handleRegisterUser, RegisterUserRequestBody } from "./handleRegisterUser";
import {
  FailedToUpdatePasswordResponse,
  handleUpdatePassword,
  SuccessfullyUpdatedPasswordResponse,
  UpdatePasswordRequestBody,
} from "./handleUpdatePassword";

interface LoginUserParams {
  username: string;
  password: string;
}

interface RequestPasswordResetParams {
  email: string;
}

export interface SuccessfulAuthResponse {
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
    public localEmailService: LocalEmailService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  @Post("register")
  public async registerUser(
    @Body() requestBody: RegisterUserRequestBody,
  ): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
    return handleRegisterUser({
      controller: this,
      requestBody,
    });
  }

  @Post("login")
  public async loginUser(
    @Body() requestBody: LoginUserParams,
  ): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
    const { username, password } = requestBody;
    const jwtPrivateKey = process.env.JWT_PRIVATE_KEY as string;

    try {
      const user_WITH_PASSWORD =
        await this.databaseService.tableNameToServicesMap.usersTableService.selectUser_WITH_PASSWORD_ByUsername(
          {
            username,
          },
        );
      if (!!user_WITH_PASSWORD) {
        const hasMatchedPassword =
          encryptPassword({ password }) === user_WITH_PASSWORD.encryptedPassword;
        if (hasMatchedPassword) {
          const userId = user_WITH_PASSWORD.userId;
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

  @Post("updatePassword")
  public async updatePassword(
    @Request() request: express.Request,
    @Body() requestBody: UpdatePasswordRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToUpdatePasswordResponse,
      SuccessfullyUpdatedPasswordResponse
    >
  > {
    return await handleUpdatePassword({
      controller: this,
      request,
      requestBody,
    });
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
