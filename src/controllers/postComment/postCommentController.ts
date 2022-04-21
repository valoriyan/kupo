import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";

import {
  CommentOnPostRequestBody,
  CommentOnPostFailed,
  handleCommentOnPost,
  CommentOnPostSuccess,
} from "./handleCommentOnPost";
import {
  GetPageOfCommentsByPostIdFailure,
  GetPageOfCommentsByPostIdRequestBody,
  handleGetPageOfCommentsByPostId,
  GetPageOfCommentsByPostIdSuccess,
} from "./handleGetPageOfCommentsByPostId";
import {
  DeleteCommentFromPostRequestBody,
  DeleteCommentFromPostFailed,
  handleDeleteCommentFromPost,
  DeleteCommentFromPostSuccess,
} from "./handleDeleteCommentFromPost";
import { BlobStorageService } from "./../../services/blobStorageService";

@injectable()
@Route("PostComment")
export class PostCommentController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
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
      CommentOnPostFailed,
      CommentOnPostSuccess
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
      GetPageOfCommentsByPostIdFailure,
      GetPageOfCommentsByPostIdSuccess
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
      DeleteCommentFromPostFailed,
      DeleteCommentFromPostSuccess
    >
  > {
    return await handleDeleteCommentFromPost({
      controller: this,
      request,
      requestBody,
    });
  }
}
