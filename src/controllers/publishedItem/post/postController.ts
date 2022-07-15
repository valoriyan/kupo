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
import { SecuredHTTPResponse } from "../../../types/monads";
import {
  CreatePostFailedReason,
  handleCreatePost,
  CreatePostSuccess,
} from "./handleCreatePost";
import {
  DeletePostRequestBody,
  DeletePostFailed,
  handleDeletePost,
  DeletePostSuccess,
} from "./handleDeletePost";
import {
  GetPageOfSavedPostsFailedReason,
  GetPageOfSavedPostsRequestBody,
  GetPageOfSavedPostsSuccess,
  handleGetPageOfSavedPosts,
} from "./handleGetPageOfSavedPosts";
import {
  GetPublishedItemByIdFailedReason,
  GetPublishedItemByIdRequestBody,
  handleGetPublishedItemById,
  GetPublishedItemByIdSuccess,
} from "../handleGetPublishedItemById";
import {
  GetPostsScheduledByUserFailed,
  GetPostsScheduledByUserRequestBody,
  handleGetPostsScheduledByUser,
  GetPostsScheduledByUserSuccess,
} from "./handleGetPostsScheduledByUser";
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
  GetPostsByUsernameFailedReason,
  GetPostsByUserIdRequestBody,
  GetPostsByUsernameRequestBody,
  handleGetPostsByUserId,
  handleGetPostsByUsername,
  GetPostsByUsernameSuccess,
} from "./pagination/handleGetPosts";

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
  ): Promise<SecuredHTTPResponse<CreatePostFailedReason, CreatePostSuccess>> {
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
  ): Promise<SecuredHTTPResponse<SharePostFailedReason, SharePostSuccess>> {
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
    SecuredHTTPResponse<GetPublishedItemByIdFailedReason, GetPublishedItemByIdSuccess>
  > {
    return await handleGetPublishedItemById({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPostsByUserId")
  public async getPostsByUserId(
    @Request() request: express.Request,
    @Body() requestBody: GetPostsByUserIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<GetPostsByUsernameFailedReason, GetPostsByUsernameSuccess>
  > {
    return await handleGetPostsByUserId({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPostsByUsername")
  public async getPostsByUsername(
    @Request() request: express.Request,
    @Body() requestBody: GetPostsByUsernameRequestBody,
  ): Promise<
    SecuredHTTPResponse<GetPostsByUsernameFailedReason, GetPostsByUsernameSuccess>
  > {
    return await handleGetPostsByUsername({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPostsScheduledByUser")
  public async getPostsScheduledByUser(
    @Request() request: express.Request,
    @Body() requestBody: GetPostsScheduledByUserRequestBody,
  ): Promise<
    SecuredHTTPResponse<GetPostsScheduledByUserFailed, GetPostsScheduledByUserSuccess>
  > {
    return await handleGetPostsScheduledByUser({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfSavedPosts")
  public async getPageOfSavedPosts(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfSavedPostsRequestBody,
  ): Promise<
    SecuredHTTPResponse<GetPageOfSavedPostsFailedReason, GetPageOfSavedPostsSuccess>
  > {
    return await handleGetPageOfSavedPosts({
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
  ): Promise<SecuredHTTPResponse<UpdatePostFailedReason, UpdatePostSuccess>> {
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
  ): Promise<SecuredHTTPResponse<DeletePostFailed, DeletePostSuccess>> {
    return await handleDeletePost({
      controller: this,
      request,
      requestBody,
    });
  }
}
