import express from "express";
import { BlobStorageService } from "../../services/blobStorageService";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import {
  FailedToFollowUserProfileResponse,
  FailedToUnfollowUserProfileResponse,
  FollowUserProfileParams,
  handleFollowUser,
  handleUnfollowUser,
  SuccessfulFollowOfUserProfileResponse,
  SuccessfulUnfollowOfUserProfileResponse,
  UnfollowUserProfileParams,
} from "./handleFollowUserProfile";

@injectable()
@Route("userInteractions")
export class UserInteractionController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  @Post("FollowUser")
  public async followUser(
    @Request() request: express.Request,
    @Body() requestBody: FollowUserProfileParams,
  ): Promise<
    SecuredHTTPResponse<
      FailedToFollowUserProfileResponse,
      SuccessfulFollowOfUserProfileResponse
    >
  > {
    return await handleFollowUser({
      controller: this,
      request,
      requestBody,
    });
  }

  @Delete("UnfollowUser")
  public async unfollowUser(
    @Request() request: express.Request,
    @Body() requestBody: UnfollowUserProfileParams,
  ): Promise<
    SecuredHTTPResponse<
      FailedToUnfollowUserProfileResponse,
      SuccessfulUnfollowOfUserProfileResponse
    >
  > {
    return await handleUnfollowUser({
      controller: this,
      request,
      requestBody,
    });
  }
}
