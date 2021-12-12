import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
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
import { DeleteCommentFromPostRequestBody, FailedToDeleteCommentFromPostResponse, handleDeleteCommentFromPost, SuccessfullyDeletedCommentFromPostResponse } from "./handleDeleteCommentFromPost";

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

  @Post("getPageOfCommentsByPostId")
  public async getPageOfCommentsByPostId(
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
  
  @Delete("deleteCommentFromPost")
  public async deleteCommentFromPost(
    @Request() request: express.Request,
    @Body() requestBody: DeleteCommentFromPostRequestBody,
  ): Promise<
    SecuredHTTPResponse<
    FailedToDeleteCommentFromPostResponse, SuccessfullyDeletedCommentFromPostResponse    >
  > {
    return await handleDeleteCommentFromPost({
      controller: this,
      request,
      requestBody,
    });
  }


}
