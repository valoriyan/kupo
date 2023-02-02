import express from "express";
import { DatabaseService } from "../../services/databaseService";
import { Body, Controller, Get, Post, Request, Route } from "tsoa";
import {
  ErrorReasonTypes,
  HTTPResponse,
  SecuredHTTPResponse,
} from "../../utilities/monads";
import { injectable } from "tsyringe";
import {
  RegisterUserFailedReason,
  handleRegisterUser,
  RegisterUserRequestBody,
} from "../user/handleRegisterUser";
import {
  UpdatePasswordFailedReason,
  handleUpdatePassword,
  UpdatePasswordSuccess,
  UpdatePasswordRequestBody,
} from "./handleUpdatePassword";
import { AuthFailedReason, AuthSuccess } from "./models";
import { handleLoginUser, LoginUserRequestBody } from "./handleLoginUser";
import { handleRefreshAccessToken } from "./handleRefreshAccessToken";
import {
  GetPasswordResetEmailFailedReason,
  handleGetPasswordResetEmail,
  GetPasswordResetEmailRequestBody,
  GetPasswordResetEmailSuccess,
} from "./passwordReset/handleGetPasswordResetEmail";
import { handleLogout } from "./handleLogout";
import { EmailService } from "../../services/emailService";
import {
  ElevateUserToAdminFailedReason,
  ElevateUserToAdminRequestBody,
  ElevateUserToAdminSuccess,
  handleElevateUserToAdmin,
} from "./handleElevateUserToAdmin";
import {
  CheckResetPasswordTokenValidityFailedReason,
  CheckResetPasswordTokenValidityRequestBody,
  CheckResetPasswordTokenValiditySuccess,
  handleCheckResetPasswordTokenValidity,
} from "./passwordReset/handleCheckResetPasswordTokenValidity";
import {
  handleResetPassword,
  ResetPasswordFailedReason,
  ResetPasswordRequestBody,
  ResetPasswordSuccess,
} from "./passwordReset/handleResetPassword";
import { PaymentProcessingService } from "../../services/paymentProcessingService";
import {
  VerifyUserEmailFailedReason,
  VerifyUserEmailRequestBody,
  VerifyUserEmailSuccess,
  handleVerifyUserEmail,
} from "./verifyUserEmail/handleVerifyUserEmail";
import {
  GetVerifyUserEmailFailedReason,
  GetVerifyUserEmailSuccess,
  handleGetVerifyUserEmail,
} from "./verifyUserEmail/handleGetVerifyUserEmail";

@injectable()
@Route("auth")
export class AuthController extends Controller {
  constructor(
    public emailService: EmailService,
    public databaseService: DatabaseService,
    public paymentProcessingService: PaymentProcessingService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("register")
  public async registerUser(
    @Request() request: express.Request,
    @Body() requestBody: RegisterUserRequestBody,
  ): Promise<
    HTTPResponse<ErrorReasonTypes<string | RegisterUserFailedReason>, AuthSuccess>
  > {
    return await handleRegisterUser({
      request,
      controller: this,
      requestBody,
    });
  }

  @Post("login")
  public async loginUser(
    @Request() request: express.Request,
    @Body() requestBody: LoginUserRequestBody,
  ): Promise<HTTPResponse<ErrorReasonTypes<string | AuthFailedReason>, AuthSuccess>> {
    return await handleLoginUser({
      controller: this,
      request,
      requestBody,
    });
  }

  @Get("refresh-access-token")
  public async refreshAccessToken(
    @Request() request: express.Request,
  ): Promise<HTTPResponse<AuthFailedReason, AuthSuccess>> {
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
      ErrorReasonTypes<string | GetPasswordResetEmailFailedReason>,
      GetPasswordResetEmailSuccess
    >
  > {
    return await handleGetPasswordResetEmail({
      controller: this,
      requestBody,
    });
  }

  @Post("getVerifyUserEmail")
  public async getVerifyUserEmail(
    @Request() request: express.Request,
  ): Promise<
    HTTPResponse<
      ErrorReasonTypes<string | GetVerifyUserEmailFailedReason>,
      GetVerifyUserEmailSuccess
    >
  > {
    return await handleGetVerifyUserEmail({
      controller: this,
      request,
    });
  }

  @Post("checkResetPasswordTokenValidity")
  public async checkResetPasswordTokenValidity(
    @Body() requestBody: CheckResetPasswordTokenValidityRequestBody,
  ): Promise<
    HTTPResponse<
      CheckResetPasswordTokenValidityFailedReason,
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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdatePasswordFailedReason>,
      UpdatePasswordSuccess
    >
  > {
    return await handleUpdatePassword({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("resetPassword")
  public async resetPassword(
    @Request() request: express.Request,
    @Body() requestBody: ResetPasswordRequestBody,
  ): Promise<
    HTTPResponse<
      ErrorReasonTypes<string | ResetPasswordFailedReason>,
      ResetPasswordSuccess
    >
  > {
    return await handleResetPassword({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("elevateUserToAdmin")
  public async elevateUserToAdmin(
    @Request() request: express.Request,
    @Body() requestBody: ElevateUserToAdminRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | ElevateUserToAdminFailedReason>,
      ElevateUserToAdminSuccess
    >
  > {
    return await handleElevateUserToAdmin({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("verifyUserEmail")
  public async verifyUserEmail(
    @Request() request: express.Request,
    @Body() requestBody: VerifyUserEmailRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | VerifyUserEmailFailedReason>,
      VerifyUserEmailSuccess
    >
  > {
    return await handleVerifyUserEmail({
      controller: this,
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
