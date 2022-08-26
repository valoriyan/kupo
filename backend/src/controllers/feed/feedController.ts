import express from "express";
import { DatabaseService } from "../../services/databaseService";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../utilities/monads";
import { Controller, Route, Request, Body, Post } from "tsoa";
import { injectable } from "tsyringe";
import { BlobStorageService } from "../../services/blobStorageService";
import {
  GetUserContentFeedFiltersFailedReason,
  GetUserContentFeedFiltersRequestBody,
  handleGetUserContentFeedFilters,
  GetUserContentFeedFiltersSuccess,
} from "./handleGetUserContentFeedFilters";
import {
  SetUserContentFeedFiltersFailedReason,
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
import {
  GetPublishedItemsFromFollowedUsersFailedReason,
  GetPublishedItemsFromFollowedUsersRequestBody,
  GetPublishedItemsFromFollowedUsersSuccess,
  handleGetPublishedItemsFromFollowedUsers,
} from "./handleGetPublishedItemsFromFollowedUsers";
import {
  GetPublishedItemsFromFollowedHashtagFailedReason,
  GetPublishedItemsFromFollowedHashtagRequestBody,
  GetPublishedItemsFromFollowedHashtagSuccess,
  handleGetPublishedItemsFromFollowedHashtag,
} from "./handleGetPublishedItemsFromFollowedHashtag";

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

  @Post("getPublishedItemsFromFollowedUsers")
  public async getPublishedItemsFromFollowedUsers(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishedItemsFromFollowedUsersRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishedItemsFromFollowedUsersFailedReason>,
      GetPublishedItemsFromFollowedUsersSuccess
    >
  > {
    return await handleGetPublishedItemsFromFollowedUsers({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPublishedItemsFromFollowedHashtag")
  public async getPublishedItemsFromFollowedHashtag(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishedItemsFromFollowedHashtagRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishedItemsFromFollowedHashtagFailedReason>,
      GetPublishedItemsFromFollowedHashtagSuccess
    >
  > {
    return await handleGetPublishedItemsFromFollowedHashtag({
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
      ErrorReasonTypes<string | SetUserContentFeedFiltersFailedReason>,
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
