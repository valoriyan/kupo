import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Body, Controller, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";

import { WasabiBlobStorageService } from "../../services/blobStorageService/WasabiBlobStorageService";
import {
  CommentOnPostRequestBody,
  FailedToCommentOnPostResponse,
  handleCommentOnPost,
  SuccessfullyCommentedOnPostResponse,
} from "./handleCommentOnPost";
import {
  FailedToGetPageOfCommentsByPostIdResponse,
  GetPageOfCommentsByPostIdRequestBody,
  handleGetPageOfCommentsByPostId,
  SuccessfullyGotPageOfCommentsByPostIdResponse,
} from "./handleGetPageOfCommentsByPostId";

@injectable()
@Route("PostComment")
export class PostCommentController extends Controller {
  constructor(
    public blobStorageService: WasabiBlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("commentOnPost")
  public async commentOnPost(
    @Request() request: express.Request,
    @Body() requestBody: CommentOnPostRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToCommentOnPostResponse,
      SuccessfullyCommentedOnPostResponse
    >
  > {
    return await handleCommentOnPost({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("handleGetPageOfCommentsByPostId")
  public async handleGetPageOfCommentsByPostId(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfCommentsByPostIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToGetPageOfCommentsByPostIdResponse,
      SuccessfullyGotPageOfCommentsByPostIdResponse
    >
  > {
    return await handleGetPageOfCommentsByPostId({
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
