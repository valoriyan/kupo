import express from "express";
import { LocalBlobStorageService } from "src/services/blobStorageService";
import { DatabaseService } from "src/services/databaseService";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { Controller, Route, Request, Body, Post } from "tsoa";
import { injectable } from "tsyringe";
import {
  FailedToGetPostsFromFollowedUsersResponse,
  GetPageOfPostFromFollowedUsersParams,
  handleGetPageOfPostFromFollowedUsers,
  SuccessfulGetPostsFromFollowedUsersResponse,
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

  @Post("getFollowedUsersPosts")
  public async getFollowedUsersPosts(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfPostFromFollowedUsersParams,
  ): Promise<
    SecuredHTTPResponse<
      FailedToGetPostsFromFollowedUsersResponse,
      SuccessfulGetPostsFromFollowedUsersResponse
    >
  > {
    return await handleGetPageOfPostFromFollowedUsers({
      controller: this,
      request,
      requestBody,
    });
  }
}
