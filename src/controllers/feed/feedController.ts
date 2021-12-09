import express from "express";
import { LocalBlobStorageService } from "../../services/blobStorageService";
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

@injectable()
@Route("feed")
export class FeedController extends Controller {
  constructor(
    public blobStorageService: LocalBlobStorageService,
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

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
