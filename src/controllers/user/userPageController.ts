import express from "express";
import { LocalBlobStorageService } from "../../services/blobStorageService";
import { Body, Controller, Post, Request, Route, UploadedFile } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import { SecuredHTTPResponse } from "../../types/httpResponse";
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
  UpdateUserProfileRequestBody,
} from "./handleUpdateUserProfile";
import {
  FailedToSearchUserProfilesByUsernameResponse,
  handleSearchUserProfilesByUsername,
  SearchUserProfilesByUsernameParams,
  SuccessfulSearchUserProfilesByUsernameResponse,
} from "./handleSearchUserProfilesByUsername";
import {
  FailedToSetUserHashtagsResponse,
  handleSetUserHashtags,
  SetUserHashtagsRequestBody,
  SuccessfullySetUserHashtagsResponse,
} from "./handleSetUserHashtags";
import {
  FailedToGetUsersByIdsResponse,
  GetUsersByIdsRequestBody,
  handleGetUsersByIds,
  SuccessfullyGotUsersByIdsRequestBodyResponse,
} from "./handleGetUsersByIds";

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
    @Body() requestBody: UpdateUserProfileRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToUpdateUserProfileResponse,
      SuccessfulUpdateToUserProfileResponse
    >
  > {
    return await handleUpdateUserProfile({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("UpdateUserProfilePicture")
  public async updateUserProfilePicture(
    @Request() request: express.Request,
    @UploadedFile("profilePicture") profilePicture: Express.Multer.File,
  ): Promise<
    SecuredHTTPResponse<
      FailedToUpdateUserProfileResponse,
      SuccessfulUpdateToUserProfileResponse
    >
  > {
    return await handleUpdateUserProfile({
      controller: this,
      request,
      requestBody: {
        profilePicture,
      },
    });
  }

  @Post("UpdateUserBackgroundImage")
  public async updateUserBackgroundImage(
    @Request() request: express.Request,
    @UploadedFile("backgroundImage") backgroundImage: Express.Multer.File,
  ): Promise<
    SecuredHTTPResponse<
      FailedToUpdateUserProfileResponse,
      SuccessfulUpdateToUserProfileResponse
    >
  > {
    return await handleUpdateUserProfile({
      controller: this,
      request,
      requestBody: {
        backgroundImage,
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

  @Post("getUsersByIds")
  public async getUsersByIds(
    @Request() request: express.Request,
    @Body() requestBody: GetUsersByIdsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToGetUsersByIdsResponse,
      SuccessfullyGotUsersByIdsRequestBodyResponse
    >
  > {
    return await handleGetUsersByIds({
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

  @Post("SetUserHashtags")
  public async setUserHashtags(
    @Request() request: express.Request,
    @Body() requestBody: SetUserHashtagsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToSetUserHashtagsResponse,
      SuccessfullySetUserHashtagsResponse
    >
  > {
    return await handleSetUserHashtags({
      controller: this,
      request,
      requestBody,
    });
  }
}
