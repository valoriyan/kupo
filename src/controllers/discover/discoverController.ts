import express from "express";
import { Body, Controller, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { BlobStorageService } from "../../services/blobStorageService";
import { DatabaseService } from "../../services/databaseService";
import { SecuredHTTPResponse } from "../../types/monads";
import {
  handleSearchForHashtags,
  SearchForHashtagsFailedReason,
  SearchForHashtagsRequestBody,
  SearchForHashtagsSuccess,
} from "./search/handleSearchForHashtags";
import {
  handleSearchForPosts,
  SearchForPostsFailedReason,
  SearchForPostsRequestBody,
  SearchForPostsSuccess,
} from "./search/handleSearchForPosts";
import {
  handleSearchForUsers,
  SearchForUsersFailedReason,
  SearchForUsersRequestBody,
  SearchForUsersSuccess,
} from "./search/handleSearchForUsers";

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

  @Post("searchForHashtags")
  public async searchForHashtags(
    @Request() request: express.Request,
    @Body() requestBody: SearchForHashtagsRequestBody,
  ): Promise<
    SecuredHTTPResponse<SearchForHashtagsFailedReason, SearchForHashtagsSuccess>
  > {
    return await handleSearchForHashtags({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("searchForPosts")
  public async searchForPosts(
    @Request() request: express.Request,
    @Body() requestBody: SearchForPostsRequestBody,
  ): Promise<SecuredHTTPResponse<SearchForPostsFailedReason, SearchForPostsSuccess>> {
    return await handleSearchForPosts({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("searchForUsers")
  public async searchForUsers(
    @Request() request: express.Request,
    @Body() requestBody: SearchForUsersRequestBody,
  ): Promise<SecuredHTTPResponse<SearchForUsersFailedReason, SearchForUsersSuccess>> {
    return await handleSearchForUsers({
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
