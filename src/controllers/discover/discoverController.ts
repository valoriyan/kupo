import express from "express";
import { DatabaseService } from "../../services/databaseService";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Controller, Route, Request, Body, Post } from "tsoa";
import { injectable } from "tsyringe";
import { BlobStorageService } from "../../services/blobStorageService";
import {
  FailedToGetPageOfDiscoverSearchResultsForPostsResponse,
  GetPageOfDiscoverSearchResultsForPostsParams,
  handleGetPageOfDiscoverSearchResultsForPosts,
  SuccessfullyGotPageOfDiscoverSearchResultsForPostsResponse,
} from "./search/handleGetPageOfDiscoverSearchResultsForPosts";
import { FailedToGetPageOfDiscoverSearchResultsForHashtagsResponse, GetPageOfDiscoverSearchResultsForHashtagsParams, handleGetPageOfDiscoverSearchResultsForHashtags, SuccessfullyGotPageOfDiscoverSearchResultsForHashtagsResponse } from "./search/handleGetPageOfDiscoverSearchResultsForHashtags";
import { FailedToGetPageOfDiscoverSearchResultsForPostCaptionsResponse, GetPageOfDiscoverSearchResultsForPostCaptionsParams, handleGetPageOfDiscoverSearchResultsForPostCaptions, SuccessfullyGotPageOfDiscoverSearchResultsForPostCaptionsResponse } from "./search/handleGetPageOfDiscoverSearchResultsForPostCaptions";
import { FailedToGetPageOfDiscoverSearchResultsForUsersResponse, GetPageOfDiscoverSearchResultsForUsersParams, handleGetPageOfDiscoverSearchResultsForUsers, SuccessfullyGotPageOfDiscoverSearchResultsForUsersResponse } from "./search/handleGetPageOfDiscoverSearchResultsForUsers";

@injectable()
@Route("discover")
export class DiscoverController extends Controller {
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

  @Post("getPageOfDiscoverSearchResultsForHashtags")
  public async getPageOfDiscoverSearchResultsForHashtags(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfDiscoverSearchResultsForHashtagsParams,
  ): Promise<
    SecuredHTTPResponse<
    FailedToGetPageOfDiscoverSearchResultsForHashtagsResponse,
    SuccessfullyGotPageOfDiscoverSearchResultsForHashtagsResponse
    >
  > {
    return await handleGetPageOfDiscoverSearchResultsForHashtags({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfDiscoverSearchResultsForPostHashtags")
  public async getPageOfDiscoverSearchResultsForPostHashtags(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfDiscoverSearchResultsForPostCaptionsParams,
  ): Promise<
    SecuredHTTPResponse<
    FailedToGetPageOfDiscoverSearchResultsForPostCaptionsResponse,
    SuccessfullyGotPageOfDiscoverSearchResultsForPostCaptionsResponse
    >
  > {
    return await handleGetPageOfDiscoverSearchResultsForPostCaptions({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfDiscoverSearchResultsForPosts")
  public async getPageOfDiscoverSearchResultsForPosts(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfDiscoverSearchResultsForPostsParams,
  ): Promise<
    SecuredHTTPResponse<
      FailedToGetPageOfDiscoverSearchResultsForPostsResponse,
      SuccessfullyGotPageOfDiscoverSearchResultsForPostsResponse
    >
  > {
    return await handleGetPageOfDiscoverSearchResultsForPosts({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfDiscoverSearchResultsForUsers")
  public async getPageOfDiscoverSearchResultsForUsers(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfDiscoverSearchResultsForUsersParams,
  ): Promise<
    SecuredHTTPResponse<
    FailedToGetPageOfDiscoverSearchResultsForUsersResponse,
    SuccessfullyGotPageOfDiscoverSearchResultsForUsersResponse
    >
  > {
    return await handleGetPageOfDiscoverSearchResultsForUsers({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
