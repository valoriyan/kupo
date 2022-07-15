import express from "express";
import { WebSocketService } from "../../services/webSocketService";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import { SecuredHTTPResponse } from "../../types/monads";
import { BlobStorageService } from "./../../services/blobStorageService";
import {
  FollowUserFailed,
  FollowUserRequestBody,
  FollowUserSuccess,
  handleFollowUser,
} from "./handleFollowUserProfile";

import {
  FailedToUnfollowUserProfileResponse,
  handleUnfollowUser,
  SuccessfullyUnfollowedUserProfileResponse,
  UnfollowUserRequestBody,
} from "./handleUnfollowUserProfile";

@injectable()
@Route("userInteractions")
export class UserInteractionController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
    public webSocketService: WebSocketService,
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
  ): Promise<SecuredHTTPResponse<FollowUserFailed, FollowUserSuccess>> {
    return await handleFollowUser({
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
}
