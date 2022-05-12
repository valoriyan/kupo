import express from "express";
import { DatabaseService } from "../../services/databaseService";
import { Body, Controller, Get, Post, Request, Route } from "tsoa";
import { HTTPResponse, SecuredHTTPResponse } from "../../types/httpResponse";
import { injectable } from "tsyringe";
import {
  RegisterUserFailed,
  handleRegisterUser,
  RegisterUserRequestBody,
} from "./handleRegisterUser";
import {
  UpdatePasswordFailed,
  handleUpdatePassword,
  UpdatePasswordSuccess,
  UpdatePasswordRequestBody,
} from "./handleUpdatePassword";
import { AuthFailed, AuthSuccess } from "./models";
import { handleLoginUser, LoginUserRequestBody } from "./handleLoginUser";
import { handleRefreshAccessToken } from "./handleRefreshAccessToken";
import {
  GetPasswordResetEmailFailed,
  handleGetPasswordResetEmail,
  GetPasswordResetEmailRequestBody,
  GetPasswordResetEmailSuccess,
} from "./passwordReset/handleGetPasswordResetEmail";
import { handleLogout } from "./handleLogout";
import { EmailService } from "../../services/emailService";
import {
  ElevateUserToAdminFailed,
  ElevateUserToAdminRequestBody,
  ElevateUserToAdminSuccess,
  handleElevateUserToAdmin,
} from "./handleElevateUserToAdmin";
import {
  handleRemoveUserFromWaitlist,
  RemoveUserFromWaitlistFailed,
  RemoveUserFromWaitlistRequestBody,
  RemoveUserFromWaitlistSuccess,
} from "./handleRemoveUserFromWaitlist";
import {
  CheckResetPasswordTokenValidityFailed,
  CheckResetPasswordTokenValidityRequestBody,
  CheckResetPasswordTokenValiditySuccess,
  handleCheckResetPasswordTokenValidity,
} from "./passwordReset/handleCheckResetPasswordTokenValidity";
import {
  handleResetPassword,
  ResetPasswordFailed,
  ResetPasswordRequestBody,
  ResetPasswordSuccess,
} from "./passwordReset/handleResetPassword";

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
  ): Promise<HTTPResponse<RegisterUserFailed, AuthSuccess>> {
    return await handleRegisterUser({
      controller: this,
      requestBody,
    });
  }

  @Post("login")
  public async loginUser(
    @Body() requestBody: LoginUserRequestBody,
  ): Promise<HTTPResponse<AuthFailed, AuthSuccess>> {
    return await handleLoginUser({
      controller: this,
      requestBody,
    });
  }

  @Get("refresh-access-token")
  public async refreshAccessToken(
    @Request() request: express.Request,
  ): Promise<HTTPResponse<AuthFailed, AuthSuccess>> {
    return await handleRefreshAccessToken({
      controller: this,
      request,
    });
  }

  @Post("getPasswordResetEmail")
  public async getPasswordResetEmail(
    @Body() requestBody: GetPasswordResetEmailRequestBody,
  ): Promise<HTTPResponse<GetPasswordResetEmailFailed, GetPasswordResetEmailSuccess>> {
    return await handleGetPasswordResetEmail({
      controller: this,
      requestBody,
    });
  }

  @Post("checkResetPasswordTokenValidity")
  public async checkResetPasswordTokenValidity(
    @Body() requestBody: CheckResetPasswordTokenValidityRequestBody,
  ): Promise<
    HTTPResponse<
      CheckResetPasswordTokenValidityFailed,
      CheckResetPasswordTokenValiditySuccess
    >
  > {
    return await handleCheckResetPasswordTokenValidity({
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

  @Post("updatePassword")
  public async updatePassword(
    @Request() request: express.Request,
    @Body() requestBody: UpdatePasswordRequestBody,
  ): Promise<SecuredHTTPResponse<UpdatePasswordFailed, UpdatePasswordSuccess>> {
    return await handleUpdatePassword({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("resetPassword")
  public async resetPassword(
    @Body() requestBody: ResetPasswordRequestBody,
  ): Promise<HTTPResponse<ResetPasswordFailed, ResetPasswordSuccess>> {
    return await handleResetPassword({
      controller: this,
      requestBody,
    });
  }

  @Post("elevateUserToAdmin")
  public async elevateUserToAdmin(
    @Request() request: express.Request,
    @Body() requestBody: ElevateUserToAdminRequestBody,
  ): Promise<SecuredHTTPResponse<ElevateUserToAdminFailed, ElevateUserToAdminSuccess>> {
    return await handleElevateUserToAdmin({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("removeUserFromWaitlist")
  public async removeUserFromWaitlist(
    @Request() request: express.Request,
    @Body() requestBody: RemoveUserFromWaitlistRequestBody,
  ): Promise<
    SecuredHTTPResponse<RemoveUserFromWaitlistFailed, RemoveUserFromWaitlistSuccess>
  > {
    return await handleRemoveUserFromWaitlist({
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
