import { Controller, Post, Route, Request } from "tsoa";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../utilities/monads";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import express from "express";
import { WebSocketService } from "../../services/webSocketService";
import { LiveStreamingService } from "../../services/liveStreamingService";
import { BlobStorageService } from "../../services/blobStorageService";
import {
  CreateLiveStreamFailedReason,
  CreateLiveStreamSuccess,
  handleCreateLiveStream,
} from "./handleCreateLiveStream";

@injectable()
@Route("live-streaming")
export class LiveStreamingController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
    public liveStreamingService: LiveStreamingService,
    public webSocketService: WebSocketService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("createLiveStream")
  public async createLiveStream(
    @Request() request: express.Request,
    // @Body() requestBody: CreateLiveStreamRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | CreateLiveStreamFailedReason>,
      CreateLiveStreamSuccess
    >
  > {
    return await handleCreateLiveStream({
      controller: this,
      request,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
