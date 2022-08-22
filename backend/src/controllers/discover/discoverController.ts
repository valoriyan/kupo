import express from "express";
import { Body, Controller, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { BlobStorageService } from "../../services/blobStorageService";
import { DatabaseService } from "../../services/databaseService";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../utilities/monads";
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
  handleSearchForPublishingChannels,
  SearchForPublishingChannelsFailedReason,
  SearchForPublishingChannelsRequestBody,
  SearchForPublishingChannelsSuccess,
} from "./search/handleSearchForPublishingChannels";
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
    SecuredHTTPResponse<
      ErrorReasonTypes<string | SearchForHashtagsFailedReason>,
      SearchForHashtagsSuccess
    >
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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | SearchForPostsFailedReason>,
      SearchForPostsSuccess
    >
  > {
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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | SearchForUsersFailedReason>,
      SearchForUsersSuccess
    >
  > {
    return await handleSearchForUsers({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("searchForPublishingChannels")
  public async searchForPublishingChannels(
    @Request() request: express.Request,
    @Body() requestBody: SearchForPublishingChannelsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | SearchForPublishingChannelsFailedReason>,
      SearchForPublishingChannelsSuccess
    >
  > {
    return await handleSearchForPublishingChannels({
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
