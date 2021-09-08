import express from "express";
import { Body, Controller, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import { HTTPResponse, SecuredHTTPResponse } from "../../types/httpResponse";
import { SecuredHTTPRequest } from "../../types/SecuredHTTPRequest";
import {
  GetUserProfileParams,
  SuccessfulGetUserProfileResponse,
  DeniedGetUserProfileResponse,
  handleGetUserProfile,
} from "./handleGetUserProfile";
import {
  FailedToUpdateUserProfileResponse,
  handleUpdateUserProfile,
  SuccessfulUpdateToUserProfileResponse,
  UpdateUserProfileParams,
} from "./handleUpdateUserProfile";

@injectable()
@Route("user")
export class UserPageController extends Controller {
  constructor(public databaseService: DatabaseService) {
    super();
  }

  @Post("UpdateUserProfile")
  public async updateUserProfile(
    @Request() request: express.Request,
    @Body() requestBody: SecuredHTTPRequest<UpdateUserProfileParams>,
  ): Promise<
    HTTPResponse<FailedToUpdateUserProfileResponse, SuccessfulUpdateToUserProfileResponse>
  > {
    return await handleUpdateUserProfile({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("GetUserProfile")
  public async getUserProfile(
    @Request() request: express.Request,
    @Body() requestBody: GetUserProfileParams,
  ): Promise<
    SecuredHTTPResponse<DeniedGetUserProfileResponse, SuccessfulGetUserProfileResponse>
  > {
    return await handleGetUserProfile({
      controller: this,
      request,
      requestBody,
    });
  }
}
