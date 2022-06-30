import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../../services/databaseService";
import {
  ReadPageOfCommentsByPublishedItemIdRequestBody,
  ReadPageOfCommentsByPublishedItemIdFailure,
  ReadPageOfCommentsByPublishedItemIdSuccess,
  handleReadPageOfCommentsByPublishedItemId,
} from "./handleReadPageOfCommentsByPublishedItemId";
import {
  handleDeletePublishedItemComment,
  DeletePublishedItemCommentRequestBody,
  DeletePublishedItemCommentFailed,
  DeletePublishedItemCommentSuccess,
} from "./handleDeletePublishedItemComment";
import { BlobStorageService } from "../../../services/blobStorageService";
import { WebSocketService } from "../../../services/webSocketService";
import { CreatePublishedItemCommentFailed, CreatePublishedItemCommentRequestBody, CreatePublishedItemCommentSuccess, handleCreatePublishedItemComment } from "./handleCreatePublishedItemComment";

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
  ): Promise<SecuredHTTPResponse<CreatePublishedItemCommentFailed, CreatePublishedItemCommentSuccess>> {
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
      ReadPageOfCommentsByPublishedItemIdFailure,
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
    SecuredHTTPResponse<DeletePublishedItemCommentFailed, DeletePublishedItemCommentSuccess>
  > {
    return await handleDeletePublishedItemComment({
      controller: this,
      request,
      requestBody,
    });
  }
}