import express from "express";
import { Body, Controller, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { BlobStorageService } from "../../services/blobStorageService";
import { DatabaseService } from "../../services/databaseService";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import {
  handleSearchForHashtags,
  SearchForHashtagsFailed,
  SearchForHashtagsParams,
  SearchForHashtagsSuccess,
} from "./search/handleSearchForHashtags";
import {
  handleSearchForPosts,
  SearchForPostsFailed,
  SearchForPostsParams,
  SearchForPostsSuccess,
} from "./search/handleSearchForPosts";
import {
  handleSearchForUsers,
  SearchForUsersFailed,
  SearchForUsersParams,
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
    @Body() requestBody: SearchForHashtagsParams,
  ): Promise<SecuredHTTPResponse<SearchForHashtagsFailed, SearchForHashtagsSuccess>> {
    return await handleSearchForHashtags({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("searchForPosts")
  public async searchForPosts(
    @Request() request: express.Request,
    @Body() requestBody: SearchForPostsParams,
  ): Promise<SecuredHTTPResponse<SearchForPostsFailed, SearchForPostsSuccess>> {
    return await handleSearchForPosts({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("searchForUsers")
  public async searchForUsers(
    @Request() request: express.Request,
    @Body() requestBody: SearchForUsersParams,
  ): Promise<SecuredHTTPResponse<SearchForUsersFailed, SearchForUsersSuccess>> {
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
