import express from "express";
import { Body, Controller, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import { PaymentProcessingService } from "../../services/paymentProcessingService";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../utilities/monads";
import { BlobStorageService } from "./../../services/blobStorageService";
import {
  GetClientUserProfileFailedReason,
  GetClientUserProfileSuccess,
  handleGetClientUserProfile,
} from "./handleGetClientUserProfile";
import {
  GetPageOfUsersFollowedByUserIdFailedReason,
  GetPageOfUsersFollowedByUserIdRequestBody,
  GetPageOfUsersFollowedByUserIdSuccess,
  handleGetPageOfUsersFollowedByUserId,
} from "./handleGetPageOfUsersFollowedByUserId";
import {
  GetPageOfUsersFollowingUserIdFailedReason,
  GetPageOfUsersFollowingUserIdRequestBody,
  GetPageOfUsersFollowingUserIdSuccess,
  handleGetPageOfUsersFollowingUserId,
} from "./handleGetPageOfUsersFollowingUserId";
import {
  GetUserProfileFailedReason,
  GetUserProfileRequestBody,
  GetUserProfileSuccess,
  handleGetUserProfile,
} from "./handleGetUserProfile";
import {
  GetUsersByIdsFailedReason,
  GetUsersByIdsRequestBody,
  GetUsersByIdsSuccess,
  handleGetUsersByIds,
} from "./handleGetUsersByIds";
import {
  GetUsersByUsernamesFailedReason,
  GetUsersByUsernamesRequestBody,
  GetUsersByUsernamesSuccess,
  handleGetUsersByUsernames,
} from "./handleGetUsersByUsernames";
import {
  handleSearchUserProfilesByUsername,
  SearchUserProfilesByUsernameFailedReason,
  SearchUserProfilesByUsernameRequestBody,
  SearchUserProfilesByUsernameSuccess,
} from "./handleSearchUserProfilesByUsername";
import {
  handleSetUserHashtags,
  SetUserHashtagsFailedReason,
  SetUserHashtagsRequestBody,
  SetUserHashtagsSuccess,
} from "./handleSetUserHashtags";
import {
  handleUpdateUserBackgroundImage,
  UpdateUserBackgroundImageFailedReason,
  UpdateUserBackgroundImageRequestBody,
  UpdateUserBackgroundImageSuccess,
} from "./handleUpdateUserBackgroundImage";
import {
  handleUpdateUserProfile,
  UpdateUserProfileFailedReason,
  UpdateUserProfileRequestBody,
  UpdateUserProfileSuccess,
} from "./handleUpdateUserProfile";
import {
  handleUpdateUserProfilePicture,
  UpdateUserProfilePictureFailedReason,
  UpdateUserProfilePictureRequestBody,
  UpdateUserProfilePictureSuccess,
} from "./handleUpdateUserProfilePicture";

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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetUserProfileFailedReason>,
      GetUserProfileSuccess
    >
  > {
    return await handleGetUserProfile({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("GetClientUserProfile")
  public async getClientUserProfile(
    @Request() request: express.Request,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetClientUserProfileFailedReason>,
      GetClientUserProfileSuccess
    >
  > {
    return await handleGetClientUserProfile({
      controller: this,
      request,
    });
  }

  @Post("getUsersByIds")
  public async getUsersByIds(
    @Request() request: express.Request,
    @Body() requestBody: GetUsersByIdsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetUsersByIdsFailedReason>,
      GetUsersByIdsSuccess
    >
  > {
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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetUsersByUsernamesFailedReason>,
      GetUsersByUsernamesSuccess
    >
  > {
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
      ErrorReasonTypes<string | SearchUserProfilesByUsernameFailedReason>,
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
      ErrorReasonTypes<string | GetPageOfUsersFollowedByUserIdFailedReason>,
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
      ErrorReasonTypes<string | GetPageOfUsersFollowingUserIdFailedReason>,
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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdateUserProfileFailedReason>,
      UpdateUserProfileSuccess
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
    @Body() requestBody: UpdateUserProfilePictureRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdateUserProfilePictureFailedReason>,
      UpdateUserProfilePictureSuccess
    >
  > {
    return await handleUpdateUserProfilePicture({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("UpdateUserBackgroundImage")
  public async updateUserBackgroundImage(
    @Request() request: express.Request,
    @Body() requestBody: UpdateUserBackgroundImageRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdateUserBackgroundImageFailedReason>,
      UpdateUserBackgroundImageSuccess
    >
  > {
    return await handleUpdateUserBackgroundImage({
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
      ErrorReasonTypes<string | SetUserHashtagsFailedReason>,
      SetUserHashtagsSuccess
    >
  > {
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
