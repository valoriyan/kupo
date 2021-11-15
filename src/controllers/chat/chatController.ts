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
import {
  FailedtoGetPageOfChatMessagesResponse,
  GetPageOfChatMessagesRequestBody,
  handleGetPageOfChatMessages,
  SuccessfulGetPageOfChatMessagesResponse,
} from "./handleGetPageOfChatMessages";
import {
  FailedtoGetPageOfChatRoomsResponse,
  GetPageOfChatRoomsRequestBody,
  handleGetPageOfChatRooms,
  SuccessfulGetPageOfChatRoomsResponse,
} from "./handleGetPageOfChatRooms";

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

  @Post("getPageOfChatMessages")
  public async getPageOfChatMessages(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfChatMessagesRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedtoGetPageOfChatMessagesResponse,
      SuccessfulGetPageOfChatMessagesResponse
    >
  > {
    return await handleGetPageOfChatMessages({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfChatRooms")
  public async getPageOfChatRooms(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfChatRoomsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      FailedtoGetPageOfChatRoomsResponse,
      SuccessfulGetPageOfChatRoomsResponse
    >
  > {
    return await handleGetPageOfChatRooms({
      controller: this,
      request,
      requestBody,
    });
  }
}
