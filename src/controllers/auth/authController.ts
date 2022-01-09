import express from "express";
import { DatabaseService } from "../../services/databaseService";
import { Body, Controller, Get, Post, Request, Route } from "tsoa";
import { HTTPResponse, SecuredHTTPResponse } from "../../types/httpResponse";
import { injectable } from "tsyringe";
import {
  FailedToRegisterUserResponse,
  handleRegisterUser,
  RegisterUserRequestBody,
} from "./handleRegisterUser";
import {
  FailedToUpdatePasswordResponse,
  handleUpdatePassword,
  SuccessfullyUpdatedPasswordResponse,
  UpdatePasswordRequestBody,
} from "./handleUpdatePassword";
import { FailedAuthResponse, SuccessfulAuthResponse } from "./models";
import { handleLoginUser, LoginUserRequestBody } from "./handleLoginUser";
import { handleRefreshAccessToken } from "./handleRefreshAccessToken";
import {
  FailedToGetPasswordResetEmailResponse,
  handleGetPasswordResetEmail,
  GetPasswordResetEmailRequestBody,
  SuccessfullyGotPasswordResetEmailResponse,
} from "./handleGetPasswordResetEmail";
import { handleLogout } from "./handleLogout";
import { EmailService } from "../../services/emailService";

@injectable()
@Route("auth")
export class AuthController extends Controller {
  constructor(
    public emailService: EmailService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////
  @Post("register")
  public async registerUser(
    @Body() requestBody: RegisterUserRequestBody,
  ): Promise<HTTPResponse<FailedToRegisterUserResponse, SuccessfulAuthResponse>> {
    return await handleRegisterUser({
      controller: this,
      requestBody,
    });
  }

  @Post("login")
  public async loginUser(
    @Body() requestBody: LoginUserRequestBody,
  ): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
    return await handleLoginUser({
      controller: this,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Get("refresh-access-token")
  public async refreshAccessToken(
    @Request() request: express.Request,
  ): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
    return await handleRefreshAccessToken({
      controller: this,
      request,
    });
  }

  @Post("getPasswordResetEmail")
  public async getPasswordResetEmail(
    @Body() requestBody: GetPasswordResetEmailRequestBody,
  ): Promise<
    HTTPResponse<
      FailedToGetPasswordResetEmailResponse,
      SuccessfullyGotPasswordResetEmailResponse
    >
  > {
    return await handleGetPasswordResetEmail({
      controller: this,
      requestBody,
    });
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

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Get("logout")
  public async logout(): Promise<void> {
    return await handleLogout({ controller: this });
  }
}
