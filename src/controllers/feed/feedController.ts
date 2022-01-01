import express from "express";
import { DatabaseService } from "../../services/databaseService";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Controller, Route, Request, Body, Post } from "tsoa";
import { injectable } from "tsyringe";
import {
  FailedToGetPageOfPostFromFollowedHashtagResponse,
  GetPageOfPostFromFollowedHashtagParams,
  handleGetPageOfPostFromFollowedHashtag,
  SuccessfulGetPageOfPostFromFollowedHashtagResponse,
} from "./handleGetPageOfPostFromFollowedHashtag";
import {
  FailedToGetPageOfPostFromFollowedUsersResponse,
  GetPageOfPostFromFollowedUsersParams,
  handleGetPageOfPostFromFollowedUsers,
  SuccessfulGetPageOfPostFromFollowedUsersResponse,
} from "./handleGetPageOfPostFromFollowedUsers";
import { BlobStorageService } from "../../services/blobStorageService";
import {
  FailedToGetUserContentFeedFiltersResponse,
  GetUserContentFeedFiltersRequestBody,
  handleGetUserContentFeedFilters,
  SuccessfullyGotUserContentFeedFiltersResponse,
} from "./handleGetUserContentFeedFilters";
import {
  FailedToSetUserContentFeedFiltersResponse,
  handleSetUserContentFeedFilters,
  SetUserContentFeedFiltersRequestBody,
  SuccessfullySetUserContentFeedFiltersResponse,
} from "./handleSetUserContentFeedFilters";

@injectable()
@Route("feed")
export class FeedController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("getPageOfPostFromFollowedUsers")
  public async getPageOfPostFromFollowedUsers(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfPostFromFollowedUsersParams,
  ): Promise<
    SecuredHTTPResponse<
      FailedToGetPageOfPostFromFollowedUsersResponse,
      SuccessfulGetPageOfPostFromFollowedUsersResponse
    >
  > {
    return await handleGetPageOfPostFromFollowedUsers({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfPostFromFollowedHashtag")
  public async getPageOfPostFromFollowedHashtag(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfPostFromFollowedHashtagParams,
  ): Promise<
    SecuredHTTPResponse<
      FailedToGetPageOfPostFromFollowedHashtagResponse,
      SuccessfulGetPageOfPostFromFollowedHashtagResponse
    >
  > {
    return await handleGetPageOfPostFromFollowedHashtag({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getUserContentFeedFilters")
  public async getUserContentFeedFilters(
    @Request() request: express.Request,
    @Body() requestBody: GetUserContentFeedFiltersRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToGetUserContentFeedFiltersResponse,
      SuccessfullyGotUserContentFeedFiltersResponse
    >
  > {
    return await handleGetUserContentFeedFilters({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("setUserContentFeedFilters")
  public async setUserContentFeedFilters(
    @Request() request: express.Request,
    @Body() requestBody: SetUserContentFeedFiltersRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToSetUserContentFeedFiltersResponse,
      SuccessfullySetUserContentFeedFiltersResponse
    >
  > {
    return await handleSetUserContentFeedFilters({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
