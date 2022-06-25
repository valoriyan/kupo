import express from "express";
import { DatabaseService } from "../../services/databaseService";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Controller, Route, Request, Body, Post } from "tsoa";
import { injectable } from "tsyringe";
import {
  GetPageOfPostFromFollowedHashtagFailed,
  GetPageOfPostFromFollowedHashtagRequestBody,
  handleGetPageOfPostFromFollowedHashtag,
  GetPageOfPostFromFollowedHashtagSuccess,
} from "./handleGetPageOfPostFromFollowedHashtag";
import {
  GetPageOfPostFromFollowedUsersFailed,
  GetPageOfPostFromFollowedUsersRequestBody,
  handleGetPageOfPostFromFollowedUsers,
  GetPageOfPostFromFollowedUsersSuccess,
} from "./handleGetPageOfPostFromFollowedUsers";
import { BlobStorageService } from "../../services/blobStorageService";
import {
  GetUserContentFeedFiltersFailed,
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
  GetPageOfAllPublishedItemsFailed,
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

  @Post("getPageOfPostFromFollowedUsers")
  public async getPageOf_ALL_PUBLISHED_ITEMS(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfAllPublishedItemsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      GetPageOfAllPublishedItemsFailed,
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
      GetPageOfPostFromFollowedUsersFailed,
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
      GetPageOfPostFromFollowedHashtagFailed,
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
    SecuredHTTPResponse<GetUserContentFeedFiltersFailed, GetUserContentFeedFiltersSuccess>
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
    SecuredHTTPResponse<SetUserContentFeedFiltersFailed, SetUserContentFeedFiltersSuccess>
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
