import express from "express";
import { WebSocketService } from "../../../services/webSocketService";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../../services/databaseService";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../../utilities/monads";
import { BlobStorageService } from "../../../services/blobStorageService";
import {
  FollowUserFailedReason,
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
import {
  GetFollowerRequestsFailedReason,
  GetFollowerRequestsRequestBody,
  GetFollowerRequestsSuccess,
  handleGetFollowerRequests,
} from "./handleGetFollowerRequests";
import {
  handleResolveFollowRequest,
  ResolveFollowRequestFailedReason,
  ResolveFollowRequestRequestBody,
  ResolveFollowRequestSuccess,
} from "./handleResolveFollowRequest";
import {
  handleResolveAllFollowRequests,
  ResolveAllFollowRequestsFailedReason,
  ResolveAllFollowRequestsRequestBody,
  ResolveAllFollowRequestsSuccess,
} from "./handleResolveAllFollowRequests";
import {
  BlockUserFailedReason,
  BlockUserRequestBody,
  BlockUserSuccess,
  handleBlockUser,
} from "./handleBlockUser";
import {
  handleUnblockUser,
  UnblockUserFailedReason,
  UnblockUserRequestBody,
  UnblockUserSuccess,
} from "./handleUnblockUser";

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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | FollowUserFailedReason>,
      FollowUserSuccess
    >
  > {
    return await handleFollowUser({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("blockUser")
  public async blockUser(
    @Request() request: express.Request,
    @Body() requestBody: BlockUserRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | BlockUserFailedReason>,
      BlockUserSuccess
    >
  > {
    return await handleBlockUser({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("getFollowerRequests")
  public async getFollowerRequests(
    @Request() request: express.Request,
    @Body() requestBody: GetFollowerRequestsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetFollowerRequestsFailedReason>,
      GetFollowerRequestsSuccess
    >
  > {
    return await handleGetFollowerRequests({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("resolveFollowRequest")
  public async resolveFollowRequest(
    @Request() request: express.Request,
    @Body() requestBody: ResolveFollowRequestRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | ResolveFollowRequestFailedReason>,
      ResolveFollowRequestSuccess
    >
  > {
    return await handleResolveFollowRequest({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("resolveAllFollowRequests")
  public async resolveAllFollowRequests(
    @Request() request: express.Request,
    @Body() requestBody: ResolveAllFollowRequestsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | ResolveAllFollowRequestsFailedReason>,
      ResolveAllFollowRequestsSuccess
    >
  > {
    return await handleResolveAllFollowRequests({
      controller: this,
      request,
      requestBody,
    });
  }

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

  @Post("unblockUser")
  public async unblockUser(
    @Request() request: express.Request,
    @Body() requestBody: UnblockUserRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UnblockUserFailedReason>,
      UnblockUserSuccess
    >
  > {
    return await handleUnblockUser({
      controller: this,
      request,
      requestBody,
    });
  }
}
