import express from "express";
import { LocalBlobStorageService } from "src/services/blobStorageService";
import { DatabaseService } from "src/services/databaseService";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { Controller, Route, Request, Body, Post } from "tsoa";
import { injectable } from "tsyringe";
import {
  FailedToGetPageOfPostFromFollowedHashtagResponse,
  GetPageOfPostFromFollowedHashtagParams,
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
    return await handleGetPageOfPostFromFollowedUsers({
      controller: this,
      request,
      requestBody,
    });
  }
}
