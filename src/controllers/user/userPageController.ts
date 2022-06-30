import express from "express";
import { Body, Controller, Post, Request, Route, UploadedFile } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import {
  GetUserProfileRequestBody,
  GetUserProfileSuccess,
  GetUserProfileFailedReason,
  handleGetUserProfile,
} from "./handleGetUserProfile";
import {
  UpdateUserProfileFailedReason,
  handleUpdateUserProfile,
  UpdateUserProfileSuccess,
  UpdateUserProfileRequestBody,
} from "./handleUpdateUserProfile";
import {
  SearchUserProfilesByUsernameFailedReason,
  handleSearchUserProfilesByUsername,
  SearchUserProfilesByUsernameRequestBody,
  SearchUserProfilesByUsernameSuccess,
} from "./handleSearchUserProfilesByUsername";
import {
  SetUserHashtagsFailed,
  handleSetUserHashtags,
  SetUserHashtagsRequestBody,
  SetUserHashtagsSuccess,
} from "./handleSetUserHashtags";
import {
  GetUsersByIdsFailed,
  GetUsersByIdsRequestBody,
  handleGetUsersByIds,
  GetUsersByIdsSuccess,
} from "./handleGetUsersByIds";
import {
  GetUsersByUsernamesFailed,
  GetUsersByUsernamesRequestBody,
  handleGetUsersByUsernames,
  GetUsersByUsernamesSuccess,
} from "./handleGetUsersByUsernames";
import { BlobStorageService } from "./../../services/blobStorageService";
import {
  GetPageOfUsersFollowedByUserIdFailed,
  GetPageOfUsersFollowedByUserIdRequestBody,
  GetPageOfUsersFollowedByUserIdSuccess,
  handleGetPageOfUsersFollowedByUserId,
} from "./handleGetPageOfUsersFollowedByUserId";
import {
  GetPageOfUsersFollowingUserIdFailed,
  GetPageOfUsersFollowingUserIdRequestBody,
  GetPageOfUsersFollowingUserIdSuccess,
  handleGetPageOfUsersFollowingUserId,
} from "./handleGetPageOfUsersFollowingUserId";
import {
  handleUpdateUserProfilePicture,
  UpdateUserProfilePictureFailedReason,
  UpdateUserProfilePictureSuccess,
} from "./handleUpdateUserProfilePicture";
import {
  handleUpdateUserBackgroundImage,
  UpdateUserBackgroundImageFailedReason,
  UpdateUserBackgroundImageSuccess,
} from "./handleUpdateUserBackgroundImage";
import { PaymentProcessingService } from "../../services/paymentProcessingService";

@injectable()
@Route("user")
export class UserPageController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
    public paymentProcessingService: PaymentProcessingService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("GetUserProfile")
  public async getUserProfile(
    @Request() request: express.Request,
    @Body() requestBody: GetUserProfileRequestBody,
  ): Promise<SecuredHTTPResponse<GetUserProfileFailedReason, GetUserProfileSuccess>> {
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
  ): Promise<SecuredHTTPResponse<GetUsersByIdsFailed, GetUsersByIdsSuccess>> {
    return await handleGetUsersByIds({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getUsersByUsernames")
  public async getUsersByUsernames(
    @Request() request: express.Request,
    @Body() requestBody: GetUsersByUsernamesRequestBody,
  ): Promise<SecuredHTTPResponse<GetUsersByUsernamesFailed, GetUsersByUsernamesSuccess>> {
    return await handleGetUsersByUsernames({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("SearchUserProfilesByUsername")
  public async searchUserProfilesByUsername(
    @Request() request: express.Request,
    @Body() requestBody: SearchUserProfilesByUsernameRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      SearchUserProfilesByUsernameFailedReason,
      SearchUserProfilesByUsernameSuccess
    >
  > {
    return await handleSearchUserProfilesByUsername({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfUsersFollowedByUserId")
  public async getPageOfUsersFollowedByUserId(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfUsersFollowedByUserIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      GetPageOfUsersFollowedByUserIdFailed,
      GetPageOfUsersFollowedByUserIdSuccess
    >
  > {
    return await handleGetPageOfUsersFollowedByUserId({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfUsersFollowingUserId")
  public async getPageOfUsersFollowingUserId(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfUsersFollowingUserIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      GetPageOfUsersFollowingUserIdFailed,
      GetPageOfUsersFollowingUserIdSuccess
    >
  > {
    return await handleGetPageOfUsersFollowingUserId({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("UpdateUserProfile")
  public async updateUserProfile(
    @Request() request: express.Request,
    @Body() requestBody: UpdateUserProfileRequestBody,
  ): Promise<SecuredHTTPResponse<UpdateUserProfileFailedReason, UpdateUserProfileSuccess>> {
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
    SecuredHTTPResponse<UpdateUserProfilePictureFailedReason, UpdateUserProfilePictureSuccess>
  > {
    return await handleUpdateUserProfilePicture({
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
    SecuredHTTPResponse<UpdateUserBackgroundImageFailedReason, UpdateUserBackgroundImageSuccess>
  > {
    return await handleUpdateUserBackgroundImage({
      controller: this,
      request,
      requestBody: {
        backgroundImage,
      },
    });
  }

  @Post("SetUserHashtags")
  public async setUserHashtags(
    @Request() request: express.Request,
    @Body() requestBody: SetUserHashtagsRequestBody,
  ): Promise<SecuredHTTPResponse<SetUserHashtagsFailed, SetUserHashtagsSuccess>> {
    return await handleSetUserHashtags({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
