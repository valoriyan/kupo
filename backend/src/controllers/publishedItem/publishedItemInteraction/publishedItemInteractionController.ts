import express from "express";
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../../utilities/monads";
import {
  handleUserSavesPublishedItem,
  UserSavesPublishedItemFailedReason,
  UserSavesPublishedItemRequestBody,
  UserSavesPublishedItemSuccess,
} from "./handleUserSavesPublishedItem";
import {
  RemoveUserLikeFromPublishedItemFailedReason,
  handleRemoveUserLikeFromPublishedItem,
  RemoveUserLikeFromPublishedItemRequestBody,
  RemoveUserLikeFromPublishedItemSuccess,
} from "./handleRemoveUserLikeFromPublishedItem";
import {
  handleUserUnsavesPublishedItem,
  UserUnsavesPublishedItemFailedReason,
  UserUnsavesPublishedItemSuccess,
} from "./handleUserUnsavesPublishedItem";
import {
  handleUserLikesPublishedItem,
  UserLikesPublishedItemFailedReason,
  UserLikesPublishedItemRequestBody,
  UserLikesPublishedItemSuccess,
} from "./handleUserLikesPublishedItem";

@injectable()
@Route("publishedItemInteractions")
export class PublishedItemInteractionController extends Controller {
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
  @Post("userLikesPublishedItem")
  public async userLikesPublishedItem(
    @Request() request: express.Request,
    @Body() requestBody: UserLikesPublishedItemRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UserLikesPublishedItemFailedReason>,
      UserLikesPublishedItemSuccess
    >
  > {
    return await handleUserLikesPublishedItem({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("userSavesPublishedItem")
  public async userSavesPublishedItem(
    @Request() request: express.Request,
    @Body() requestBody: UserSavesPublishedItemRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UserSavesPublishedItemFailedReason>,
      UserSavesPublishedItemSuccess
    >
  > {
    return await handleUserSavesPublishedItem({
      controller: this,
      request,
      requestBody,
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

  @Delete("removeUserLikeFromPublishedItem")
  public async removeUserLikeFromPublishedItem(
    @Request() request: express.Request,
    @Body() requestBody: RemoveUserLikeFromPublishedItemRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | RemoveUserLikeFromPublishedItemFailedReason>,
      RemoveUserLikeFromPublishedItemSuccess
    >
  > {
    return await handleRemoveUserLikeFromPublishedItem({
      controller: this,
      request,
      requestBody,
    });
  }

  @Delete("userUnsavesPublishedItem")
  public async userUnsavesPublishedItem(
    @Request() request: express.Request,
    @Body() requestBody: RemoveUserLikeFromPublishedItemRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UserUnsavesPublishedItemFailedReason>,
      UserUnsavesPublishedItemSuccess
    >
  > {
    return await handleUserUnsavesPublishedItem({
      controller: this,
      request,
      requestBody,
    });
  }
}
