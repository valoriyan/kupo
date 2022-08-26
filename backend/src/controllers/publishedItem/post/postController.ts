import express from "express";
import {
  Body,
  Controller,
  Delete,
  FormField,
  Post,
  Request,
  Route,
  UploadedFiles,
} from "tsoa";
import { injectable } from "tsyringe";
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../../utilities/monads";
import {
  CreatePostFailedReason,
  handleCreatePost,
  CreatePostSuccess,
} from "./handleCreatePost";
import {
  DeletePostRequestBody,
  DeletePostFailedReason,
  handleDeletePost,
  DeletePostSuccess,
} from "./handleDeletePost";
import {
  GetSavedPublishedItemsFailedReason,
  GetSavedPublishedItemsRequestBody,
  GetSavedPublishedItemsSuccess,
  handleGetSavedPublishedItems,
} from "../handleGetSavedPublishedItems";
import {
  GetPublishedItemByIdFailedReason,
  GetPublishedItemByIdRequestBody,
  handleGetPublishedItemById,
  GetPublishedItemByIdSuccess,
} from "../handleGetPublishedItemById";
import {
  GetPublishedItemsScheduledByUserFailedReason,
  GetPublishedItemsScheduledByUserRequestBody,
  handleGetPublishedItemsScheduledByUser,
  GetPublishedItemsScheduledByUserSuccess,
} from "./handleGetPublishedItemsScheduledByUser";
import {
  SharePostFailedReason,
  handleSharePost,
  SharePostRequestBody,
  SharePostSuccess,
} from "./handleSharePost";
import {
  UpdatePostFailedReason,
  handleUpdatePost,
  UpdatePostSuccess,
  UpdatePostRequestBody,
} from "./handleUpdatePost";
import {
  GetPublishedItemsByUsernameFailedReason,
  GetPublishedItemsByUserIdRequestBody,
  GetPublishedItemsByUsernameRequestBody,
  handleGetPublishedItemsByUserId,
  handleGetPublishedItemsByUsername,
  GetPublishedItemsByUsernameSuccess,
} from "../handleGetPublishedItems";

@injectable()
@Route("post")
export class PostController extends Controller {
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

  @Post("createPost")
  public async createPost(
    @Request() request: express.Request,
    @UploadedFiles() mediaFiles: Express.Multer.File[],
    @FormField() caption: string,
    // @FormField() only supports strings so we'll have to do some parsing
    // for the following fields
    @FormField() hashtags: string, // string[]
    @FormField() scheduledPublicationTimestamp?: string, // number
    @FormField() expirationTimestamp?: string, // number
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | CreatePostFailedReason>,
      CreatePostSuccess
    >
  > {
    return await handleCreatePost({
      controller: this,
      request,
      requestBody: {
        mediaFiles,
        caption,
        hashtags: JSON.parse(hashtags),
        scheduledPublicationTimestamp: scheduledPublicationTimestamp
          ? parseInt(scheduledPublicationTimestamp, 10)
          : undefined,
        expirationTimestamp: expirationTimestamp
          ? parseInt(expirationTimestamp, 10)
          : undefined,
      },
    });
  }

  @Post("sharePost")
  public async sharePost(
    @Request() request: express.Request,
    @Body() requestBody: SharePostRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | SharePostFailedReason>,
      SharePostSuccess
    >
  > {
    return await handleSharePost({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("getPublishedItemById")
  public async getPublishedItemById(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishedItemByIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishedItemByIdFailedReason>,
      GetPublishedItemByIdSuccess
    >
  > {
    return await handleGetPublishedItemById({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPublishedItemsByUserId")
  public async getPublishedItemsByUserId(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishedItemsByUserIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishedItemsByUsernameFailedReason>,
      GetPublishedItemsByUsernameSuccess
    >
  > {
    return await handleGetPublishedItemsByUserId({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPublishedItemsByUsername")
  public async getPublishedItemsByUsername(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishedItemsByUsernameRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishedItemsByUsernameFailedReason>,
      GetPublishedItemsByUsernameSuccess
    >
  > {
    return await handleGetPublishedItemsByUsername({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPostsScheduledByUser")
  public async getPostsScheduledByUser(
    @Request() request: express.Request,
    @Body() requestBody: GetPublishedItemsScheduledByUserRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetPublishedItemsScheduledByUserFailedReason>,
      GetPublishedItemsScheduledByUserSuccess
    >
  > {
    return await handleGetPublishedItemsScheduledByUser({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getSavedPublishedItems")
  public async getSavedPublishedItems(
    @Request() request: express.Request,
    @Body() requestBody: GetSavedPublishedItemsRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetSavedPublishedItemsFailedReason>,
      GetSavedPublishedItemsSuccess
    >
  > {
    return await handleGetSavedPublishedItems({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("updatePost")
  public async updatePost(
    @Request() request: express.Request,
    @Body() requestBody: UpdatePostRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdatePostFailedReason>,
      UpdatePostSuccess
    >
  > {
    return await handleUpdatePost({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
  @Delete("deletePost")
  public async deletePost(
    @Request() request: express.Request,
    @Body() requestBody: DeletePostRequestBody,
  ): Promise<SecuredHTTPResponse<ErrorReasonTypes<string | DeletePostFailedReason>, DeletePostSuccess>> {
    return await handleDeletePost({
      controller: this,
      request,
      requestBody,
    });
  }
}
