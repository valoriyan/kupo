import express from "express";
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { SecuredHTTPResponse } from "../../../utilities/monads";
import {
  handleUserSavesPublishedItem,
  UserSavesPublishedItemFailed,
  UserSavesPublishedItemRequestBody,
  UserSavesPublishedItemSuccess,
} from "./handleUserSavesPublishedItem";
import {
  FailedToRemoveUserLikeFromPublishedItemResponse,
  handleRemoveUserLikeFromPublishedItem,
  RemoveUserLikeFromPublishedItemRequestBody,
  SuccessfullyRemovedUserLikeFromPostResponse,
} from "./handleRemoveUserLikeFromPublishedItem";
import {
  handleUserUnsavesPublishedItem,
  UserUnsavesPublishedItemFailed,
  UserUnsavesPublishedItemSuccess,
} from "./handleUserUnsavesPublishedItem";
import {
  handleUserLikesPublishedItem,
  UserLikesPublishedItemFailed,
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
    SecuredHTTPResponse<UserLikesPublishedItemFailed, UserLikesPublishedItemSuccess>
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
    SecuredHTTPResponse<UserSavesPublishedItemFailed, UserSavesPublishedItemSuccess>
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
      FailedToRemoveUserLikeFromPublishedItemResponse,
      SuccessfullyRemovedUserLikeFromPostResponse
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
    SecuredHTTPResponse<UserUnsavesPublishedItemFailed, UserUnsavesPublishedItemSuccess>
  > {
    return await handleUserUnsavesPublishedItem({
      controller: this,
      request,
      requestBody,
    });
  }
}
