import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import {
  FailedToFollowUserResponse,
  FollowUserRequestBody,
  handleFollowUser,
  SuccessfullyFollowedUserResponse,
} from "./handleFollowUserProfile";
import {
  FailedToUnfollowUserProfileResponse,
  handleUnfollowUser,
  SuccessfullyUnfollowedUserProfileResponse,
  UnfollowUserRequestBody,
} from "./handleUnfollowUserProfile";
import {
  FailedToLikePostByUserResponse,
  handleUserLikesPost,
  SuccessfulUserLikesPostResponse,
  UserLikesPostRequestBody,
} from "./handleUserLikesPost";
import {
  FailedToRemoveUserLikeFromPostResponse,
  handleRemoveUserLikeFromPost,
  RemoveUserLikeFromPostRequestBody,
  SuccessfullyRemovedUserLikeFromPostResponse,
} from "./handleRemoveUserLikeFromPost";
import { BlobStorageService } from "./../../services/blobStorageService";
import { handleUserSavesPost, UserSavesPostFailed, UserSavesPostRequestBody, UserSavesPostSuccess } from "./handleUserSavesPost";
@injectable()
@Route("userInteractions")
export class UserInteractionController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("followUser")
  public async followUser(
    @Request() request: express.Request,
    @Body() requestBody: FollowUserRequestBody,
  ): Promise<
    SecuredHTTPResponse<FailedToFollowUserResponse, SuccessfullyFollowedUserResponse>
  > {
    return await handleFollowUser({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("userLikesPost")
  public async userLikesPost(
    @Request() request: express.Request,
    @Body() requestBody: UserLikesPostRequestBody,
  ): Promise<
    SecuredHTTPResponse<FailedToLikePostByUserResponse, SuccessfulUserLikesPostResponse>
  > {
    return await handleUserLikesPost({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("userSavesPost")
  public async userSavesPost(
    @Request() request: express.Request,
    @Body() requestBody: UserSavesPostRequestBody,
  ): Promise<
    SecuredHTTPResponse<UserSavesPostFailed, UserSavesPostSuccess>
  > {
    return await handleUserSavesPost({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Delete("unfollowUser")
  public async unfollowUser(
    @Request() request: express.Request,
    @Body() requestBody: UnfollowUserRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToUnfollowUserProfileResponse,
      SuccessfullyUnfollowedUserProfileResponse
    >
  > {
    return await handleUnfollowUser({
      controller: this,
      request,
      requestBody,
    });
  }

  @Delete("removeUserLikeFromPost")
  public async removeUserLikeFromPost(
    @Request() request: express.Request,
    @Body() requestBody: RemoveUserLikeFromPostRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToRemoveUserLikeFromPostResponse,
      SuccessfullyRemovedUserLikeFromPostResponse
    >
  > {
    return await handleRemoveUserLikeFromPost({
      controller: this,
      request,
      requestBody,
    });
  }

  @Delete("userUnsavesPost")
  public async userUnsavesPost(
    @Request() request: express.Request,
    @Body() requestBody: RemoveUserLikeFromPostRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToRemoveUserLikeFromPostResponse,
      SuccessfullyRemovedUserLikeFromPostResponse
    >
  > {
    return await handleRemoveUserLikeFromPost({
      controller: this,
      request,
      requestBody,
    });
  }
}
