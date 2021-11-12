import { Controller, Post, Route, Request, Body } from "tsoa";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { injectable } from "tsyringe";
import { LocalBlobStorageService } from "../../services/blobStorageService";
import { DatabaseService } from "../../services/databaseService";
import express from "express";
import { WebSocketService } from "../../services/webSocketService";
import {
  CreateChatMessageRequestBody,
  FailedToCreateChatMessageResponse,
  handleCreateChatMessage,
  SuccessfulChatMessageCreationResponse,
} from "./handleCreateChatMessage";

@injectable()
@Route("chat")
export class ChatController extends Controller {
  constructor(
    public blobStorageService: LocalBlobStorageService,
    public databaseService: DatabaseService,
    public webSocketService: WebSocketService,
  ) {
    super();
  }

  @Post("create")
  public async createChatMessage(
    @Request() request: express.Request,
    @Body() requestBody: CreateChatMessageRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedToCreateChatMessageResponse,
      SuccessfulChatMessageCreationResponse
    >
  > {
    return await handleCreateChatMessage({
      controller: this,
      request,
      requestBody,
    });
  }
}
