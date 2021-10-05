import express from "express";
import { BlobStorageService } from "../../services/blobStorageService";
import { Body, Controller, FormField, Post, Request, Route, UploadedFile } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import { HTTPResponse, SecuredHTTPResponse } from "../../types/httpResponse";
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
} from "./handleUpdateUserProfile";
import { ProfilePrivacySetting } from "./models";

@injectable()
@Route("user")
export class UserPageController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  @Post("UpdateUserProfile")
  public async updateUserProfile(
    @Request() request: express.Request,
    @FormField() username?: string,
    @FormField() shortBio?: string,
    @FormField() userWebsite?: string,
    @FormField() profileVisibility?: ProfilePrivacySetting,
    @UploadedFile() backgroundImage?: Express.Multer.File,
    @UploadedFile() profilePicture?: Express.Multer.File,
  ): Promise<
    HTTPResponse<FailedToUpdateUserProfileResponse, SuccessfulUpdateToUserProfileResponse>
  > {
    return await handleUpdateUserProfile({
      controller: this,
      request,
      requestBody: {
        username,
        shortBio,
        userWebsite,
        profileVisibility,
        backgroundImage,
        profilePicture,
      },
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