import express from "express";
import { SecuredHTTPResponse } from "../../../types/monads";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../../services/databaseService";
import {
  ReadPageOfCommentsByPublishedItemIdRequestBody,
  ReadPageOfCommentsByPublishedItemIdFailedReason,
  ReadPageOfCommentsByPublishedItemIdSuccess,
  handleReadPageOfCommentsByPublishedItemId,
} from "./handleReadPageOfCommentsByPublishedItemId";
import {
  handleDeletePublishedItemComment,
  DeletePublishedItemCommentRequestBody,
  DeletePublishedItemCommentFailedReason,
  DeletePublishedItemCommentSuccess,
} from "./handleDeletePublishedItemComment";
import { BlobStorageService } from "../../../services/blobStorageService";
import { WebSocketService } from "../../../services/webSocketService";
import {
  CreatePublishedItemCommentFailedReason,
  CreatePublishedItemCommentRequestBody,
  CreatePublishedItemCommentSuccess,
  handleCreatePublishedItemComment,
} from "./handleCreatePublishedItemComment";

@injectable()
@Route("PublishedItemComment")
export class PublishedItemCommentController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
    public webSocketService: WebSocketService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("createPublishedItemComment")
  public async createPublishedItemComment(
    @Request() request: express.Request,
    @Body() requestBody: CreatePublishedItemCommentRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      CreatePublishedItemCommentFailedReason,
      CreatePublishedItemCommentSuccess
    >
  > {
    return await handleCreatePublishedItemComment({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("readPageOfCommentsByPublishedItemId")
  public async readPageOfCommentsByPublishedItemId(
    @Request() request: express.Request,
    @Body() requestBody: ReadPageOfCommentsByPublishedItemIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ReadPageOfCommentsByPublishedItemIdFailedReason,
      ReadPageOfCommentsByPublishedItemIdSuccess
    >
  > {
    return await handleReadPageOfCommentsByPublishedItemId({
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

  @Delete("deletePublishedItemComment")
  public async deletePublishedItemComment(
    @Request() request: express.Request,
    @Body() requestBody: DeletePublishedItemCommentRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      DeletePublishedItemCommentFailedReason,
      DeletePublishedItemCommentSuccess
    >
  > {
    return await handleDeletePublishedItemComment({
      controller: this,
      request,
      requestBody,
    });
  }
}
