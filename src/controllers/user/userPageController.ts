import express from "express";
import { LocalBlobStorageService } from "../../services/blobStorageService";
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
import {
  FailedToSearchUserProfilesByUsernameResponse,
  handleSearchUserProfilesByUsername,
  SearchUserProfilesByUsernameParams,
  SuccessfulSearchUserProfilesByUsernameResponse,
} from "./handleSearchUserProfilesByUsername";

@injectable()
@Route("user")
export class UserPageController extends Controller {
  constructor(
    public blobStorageService: LocalBlobStorageService,
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
    console.log("this.blobStorageService");
    console.log(this.blobStorageService);

    return await handleGetUserProfile({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("SearchUserProfilesByUsername")
  public async searchUserProfilesByUsername(
    @Request() request: express.Request,
    @Body() requestBody: SearchUserProfilesByUsernameParams,
  ): Promise<
    SecuredHTTPResponse<
      FailedToSearchUserProfilesByUsernameResponse,
      SuccessfulSearchUserProfilesByUsernameResponse
    >
  > {
    return await handleSearchUserProfilesByUsername({
      controller: this,
      request,
      requestBody,
    });
  }
}
