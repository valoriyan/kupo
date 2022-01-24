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

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
