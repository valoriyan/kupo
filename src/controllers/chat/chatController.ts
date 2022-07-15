import { Controller, Post, Route, Request, Body } from "tsoa";
import { SecuredHTTPResponse } from "../../types/monads";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import express from "express";
import { WebSocketService } from "../../services/webSocketService";
import {
  CreateChatMessageRequestBody,
  CreateChatMessageFailedReason,
  handleCreateChatMessage,
  CreateChatMessageSuccess,
} from "./handleCreateChatMessage";
import {
  GetPageOfChatMessagesFailedReason,
  GetPageOfChatMessagesRequestBody,
  handleGetPageOfChatMessages,
  GetPageOfChatMessagesSuccess,
} from "./handleGetPageOfChatMessages";
import {
  GetPageOfChatRoomsFailedReason,
  GetPageOfChatRoomsRequestBody,
  handleGetPageOfChatRooms,
  GetPageOfChatRoomsSuccess,
} from "./handleGetPageOfChatRooms";
import {
  DoesChatRoomExistWithUserIdsRequestBody,
  DoesChatRoomExistWithUserIdsFailedReason,
  handleDoesChatRoomExistWithUserIds,
  DoesChatRoomExistWithUserIdsSuccess,
} from "./handleDoesChatRoomExistWithUserIds";
import {
  CreateChatMessageInNewRoomRequestBody,
  CreateChatMessageInNewChatRoomFailedReason,
  handleCreateChatMessageInNewChatRoom,
  CreateChatMessageInNewChatRoomSuccess,
} from "./handleCreateChatMessageInNewChatRoom";
import {
  DeleteChatMessageRequestBody,
  DeleteChatMessageFailedReason,
  handleDeleteChatMessage,
  DeleteChatMessageSuccess,
} from "./handleDeleteChatMessage";
import {
  GetChatRoomByIdFailedReason,
  GetChatRoomByIdRequestBody,
  handleGetChatRoomById,
  GetChatRoomByIdSuccess,
} from "./handleGetChatRoomById";
import { BlobStorageService } from "../../services/blobStorageService";

@injectable()
@Route("chat")
export class ChatController extends Controller {
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

  @Post("create")
  public async createChatMessage(
    @Request() request: express.Request,
    @Body() requestBody: CreateChatMessageRequestBody,
  ): Promise<
    SecuredHTTPResponse<CreateChatMessageFailedReason, CreateChatMessageSuccess>
  > {
    return await handleCreateChatMessage({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("createChatMessageInNewChatRoom")
  public async createChatMessageInNewChatRoom(
    @Request() request: express.Request,
    @Body() requestBody: CreateChatMessageInNewRoomRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      CreateChatMessageInNewChatRoomFailedReason,
      CreateChatMessageInNewChatRoomSuccess
    >
  > {
    return await handleCreateChatMessageInNewChatRoom({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("getPageOfChatMessages")
  public async getPageOfChatMessages(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfChatMessagesRequestBody,
  ): Promise<
    SecuredHTTPResponse<GetPageOfChatMessagesFailedReason, GetPageOfChatMessagesSuccess>
  > {
    return await handleGetPageOfChatMessages({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getChatRoomById")
  public async getChatRoomById(
    @Request() request: express.Request,
    @Body() requestBody: GetChatRoomByIdRequestBody,
  ): Promise<SecuredHTTPResponse<GetChatRoomByIdFailedReason, GetChatRoomByIdSuccess>> {
    return await handleGetChatRoomById({
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
    SecuredHTTPResponse<GetPageOfChatRoomsFailedReason, GetPageOfChatRoomsSuccess>
  > {
    return await handleGetPageOfChatRooms({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("doesChatRoomExistWithUserIds")
  public async doesChatRoomExistWithUserIds(
    @Request() request: express.Request,
    @Body() requestBody: DoesChatRoomExistWithUserIdsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      DoesChatRoomExistWithUserIdsFailedReason,
      DoesChatRoomExistWithUserIdsSuccess
    >
  > {
    return await handleDoesChatRoomExistWithUserIds({
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

  @Post("deleteChatMessage")
  public async deleteChatMessage(
    @Request() request: express.Request,
    @Body() requestBody: DeleteChatMessageRequestBody,
  ): Promise<
    SecuredHTTPResponse<DeleteChatMessageFailedReason, DeleteChatMessageSuccess>
  > {
    return await handleDeleteChatMessage({
      controller: this,
      request,
      requestBody,
    });
  }
}
