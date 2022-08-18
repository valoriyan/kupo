import express from "express";
import { Body, Controller, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import { WebSocketService } from "../../services/webSocketService";

import { BlobStorageService } from "../../services/blobStorageService";
import {
  CreatePublishingChannelFailedReason,
  CreatePublishingChannelRequestBody,
  CreatePublishingChannelSuccess,
  handleCreatePublishingChannel,
} from "./handleCreatePublishingChannel";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../utilities/monads";
import {
  handleUpdatePublishingChannel,
  UpdatePublishingChannelFailedReason,
  UpdatePublishingChannelRequestBody,
  UpdatePublishingChannelSuccess,
} from "./handleUpdatePublishingChannel";
import {
  handleSubmitPublishedItemToPublishingChannel,
  SubmitPublishedItemToPublishingChannelFailedReason,
  SubmitPublishedItemToPublishingChannelRequestBody,
  SubmitPublishedItemToPublishingChannelSuccess,
} from "./handleSubmitPublishedItemToPublishingChannel";
import {
  GetPublishingChannelByIdFailedReason,
  GetPublishingChannelByIdRequestBody,
  GetPublishingChannelByIdSuccess,
  handleGetPublishingChannelById,
} from "./handleGetPublishingChannelById";
import {
  handleResolvePublishingChannelSubmission,
  ResolvePublishingChannelSubmissionFailedReason,
  ResolvePublishingChannelSubmissionRequestBody,
  ResolvePublishingChannelSubmissionSuccess,
} from "./handleResolvePublishingChannelSubmission";

@injectable()
@Route("publishing_channel")
export class PublishingChannelController extends Controller {
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

  @Post("createPublishingChannel")
  public async createPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: CreatePublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | CreatePublishingChannelFailedReason>,
      CreatePublishingChannelSuccess
    >
  > {
    return await handleCreatePublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("submitPublishedItemToPublishingChannel")
  public async submitPublishedItemToPublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: SubmitPublishedItemToPublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | SubmitPublishedItemToPublishingChannelFailedReason>,
      SubmitPublishedItemToPublishingChannelSuccess
    >
  > {
    return await handleSubmitPublishedItemToPublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////
  @Post("getPublishingChannelById")
  public async getPublishingChannelById(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishingChannelByIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishingChannelByIdFailedReason>,
      GetPublishingChannelByIdSuccess
    >
  > {
    return await handleGetPublishingChannelById({
      controller: this,
      request,
      requestBody,
    });
  }
  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("updatePublishingChannel")
  public async updatePublishingChannel(
    @Request() request: express.Request,
    @Body() requestBody: UpdatePublishingChannelRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdatePublishingChannelFailedReason>,
      UpdatePublishingChannelSuccess
    >
  > {
    return await handleUpdatePublishingChannel({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("resolvePublishingChannelSubmission")
  public async resolvePublishingChannelSubmission(
    @Request() request: express.Request,
    @Body() requestBody: ResolvePublishingChannelSubmissionRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | ResolvePublishingChannelSubmissionFailedReason>,
      ResolvePublishingChannelSubmissionSuccess
    >
  > {
    return await handleResolvePublishingChannelSubmission({
      controller: this,
      request,
      requestBody,
    });
  }
  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
