import express from "express";
import { DatabaseService } from "../../services/databaseService";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../utilities/monads";
import { Controller, Route, Request, Body, Post } from "tsoa";
import { injectable } from "tsyringe";
import {
  GetPageOfPostFromFollowedHashtagFailedReason,
  GetPageOfPostFromFollowedHashtagRequestBody,
  handleGetPageOfPostFromFollowedHashtag,
  GetPageOfPostFromFollowedHashtagSuccess,
} from "./handleGetPageOfPostFromFollowedHashtag";
import {
  GetPageOfPostFromFollowedUsersFailedReason,
  GetPageOfPostFromFollowedUsersRequestBody,
  handleGetPageOfPostFromFollowedUsers,
  GetPageOfPostFromFollowedUsersSuccess,
} from "./handleGetPageOfPostFromFollowedUsers";
import { BlobStorageService } from "../../services/blobStorageService";
import {
  GetUserContentFeedFiltersFailedReason,
  GetUserContentFeedFiltersRequestBody,
  handleGetUserContentFeedFilters,
  GetUserContentFeedFiltersSuccess,
} from "./handleGetUserContentFeedFilters";
import {
  SetUserContentFeedFiltersFailed,
  handleSetUserContentFeedFilters,
  SetUserContentFeedFiltersRequestBody,
  SetUserContentFeedFiltersSuccess,
} from "./handleSetUserContentFeedFilters";
import {
  GetPageOfAllPublishedItemsFailedReason,
  GetPageOfAllPublishedItemsRequestBody,
  GetPageOfAllPublishedItemsSuccess,
  handleGetPageOfAllPublishedItems,
} from "./handleGetPageOfAllPublishedItems";

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

  @Post("getPageOf_ALL_PUBLISHED_ITEMS")
  public async getPageOf_ALL_PUBLISHED_ITEMS(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfAllPublishedItemsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPageOfAllPublishedItemsFailedReason>,
      GetPageOfAllPublishedItemsSuccess
    >
  > {
    return await handleGetPageOfAllPublishedItems({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfPostFromFollowedUsers")
  public async getPageOfPostFromFollowedUsers(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfPostFromFollowedUsersRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPageOfPostFromFollowedUsersFailedReason>,
      GetPageOfPostFromFollowedUsersSuccess
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
    @Body() requestBody: GetPageOfPostFromFollowedHashtagRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPageOfPostFromFollowedHashtagFailedReason>,
      GetPageOfPostFromFollowedHashtagSuccess
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
      ErrorReasonTypes<string | GetUserContentFeedFiltersFailedReason>,
      GetUserContentFeedFiltersSuccess
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
      ErrorReasonTypes<string | SetUserContentFeedFiltersFailed>,
      SetUserContentFeedFiltersSuccess
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
