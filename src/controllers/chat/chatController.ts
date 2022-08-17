import { Controller, Post, Route, Request, Body } from "tsoa";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../utilities/monads";
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
import {
  handleMarkChatRoomAsRead,
  MarkChatRoomAsReadFailedReason,
  MarkChatRoomAsReadRequestBody,
  MarkChatRoomAsReadSuccess,
} from "./handleMarkChatRoomAsRead";

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
    SecuredHTTPResponse<
      ErrorReasonTypes<string | CreateChatMessageFailedReason>,
      CreateChatMessageSuccess
    >
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
      ErrorReasonTypes<string | CreateChatMessageInNewChatRoomFailedReason>,
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
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPageOfChatMessagesFailedReason>,
      GetPageOfChatMessagesSuccess
    >
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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetChatRoomByIdFailedReason>,
      GetChatRoomByIdSuccess
    >
  > {
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
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPageOfChatRoomsFailedReason>,
      GetPageOfChatRoomsSuccess
    >
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
      ErrorReasonTypes<string | DoesChatRoomExistWithUserIdsFailedReason>,
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

  @Post("markChatRoomAsRead")
  public async markChatRoomAsRead(
    @Request() request: express.Request,
    @Body() requestBody: MarkChatRoomAsReadRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | MarkChatRoomAsReadFailedReason>,
      MarkChatRoomAsReadSuccess
    >
  > {
    return await handleMarkChatRoomAsRead({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("deleteChatMessage")
  public async deleteChatMessage(
    @Request() request: express.Request,
    @Body() requestBody: DeleteChatMessageRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | DeleteChatMessageFailedReason>,
      DeleteChatMessageSuccess
    >
  > {
    return await handleDeleteChatMessage({
      controller: this,
      request,
      requestBody,
    });
  }
}
