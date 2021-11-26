import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { Controller, Post, Route, Request, Body } from "tsoa";
import { injectable } from "tsyringe";
import { LocalBlobStorageService } from "../../services/blobStorageService";
import { DatabaseService } from "../../services/databaseService";
import { WebSocketService } from "../../services/webSocketService";
import {
  FailedtoGetPageOfNotificationsResponse,
  GetPageOfNotificationsRequestBody,
  handleGetPageOfNotifications,
  SuccessfullyGotPageOfNotificationsResponse,
} from "./handleGetPageOfNotifications";

@injectable()
@Route("notification")
export class NotificationController extends Controller {
  constructor(
    public blobStorageService: LocalBlobStorageService,
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
    SecuredHTTPResponse<
      FailedtoGetPageOfNotificationsResponse,
      SuccessfullyGotPageOfNotificationsResponse
    >
  > {
    return await handleGetPageOfNotifications({
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
