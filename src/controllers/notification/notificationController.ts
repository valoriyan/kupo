import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Controller, Post, Route, Request, Body } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import { WebSocketService } from "../../services/webSocketService";
import {
  GetPageOfNotificationsFailed,
  GetPageOfNotificationsRequestBody,
  handleGetPageOfNotifications,
  GetPageOfNotificationsSuccess,
} from "./handleGetPageOfNotifications";
import { BlobStorageService } from "./../../services/blobStorageService";
import { GetCountOfUnreadNotificationsByUserIdFailed, GetCountOfUnreadNotificationsByUserIdRequestBody, GetCountOfUnreadNotificationsByUserIdSuccess, handleGetCountOfUnreadNotificationsByUserId } from "./handleGetCountOfUnreadNotificationsByUserId";

@injectable()
@Route("notification")
export class NotificationController extends Controller {
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

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("getPageOfNotifications")
  public async getPageOfNotifications(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfNotificationsRequestBody,
  ): Promise<
    SecuredHTTPResponse<GetPageOfNotificationsFailed, GetPageOfNotificationsSuccess>
  > {
    return await handleGetPageOfNotifications({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getCountOfUnreadNotificationsByUserId")
  public async getCountOfUnreadNotificationsByUserId(
    @Request() request: express.Request,
    @Body() requestBody: GetCountOfUnreadNotificationsByUserIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<GetCountOfUnreadNotificationsByUserIdFailed, GetCountOfUnreadNotificationsByUserIdSuccess>
  > {
    return await handleGetCountOfUnreadNotificationsByUserId({
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
