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
import {
  GetCountOfUnreadNotificationsFailed,
  GetCountOfUnreadNotificationsSuccess,
  handleGetCountOfUnreadNotifications,
} from "./handleGetCountOfUnreadNotifications";

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

  @Post("getCountOfUnreadNotifications")
  public async getCountOfUnreadNotifications(
    @Request() request: express.Request,
  ): Promise<
    SecuredHTTPResponse<
      GetCountOfUnreadNotificationsFailed,
      GetCountOfUnreadNotificationsSuccess
    >
  > {
    return await handleGetCountOfUnreadNotifications({
      controller: this,
      request,
    });
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
