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
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import {
  CreatePostFailed,
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
  GetPageOfSavedPostsFailed,
  GetPageOfSavedPostsRequestBody,
  GetPageOfSavedPostsSuccess,
  handleGetPageOfSavedPosts,
} from "./handleGetPageOfSavedPosts";
import {
  GetPostByIdFailed,
  GetPostByIdRequestBody,
  handleGetPostById,
  GetPostByIdSuccess,
} from "./handleGetPostById";
import {
  GetPostsScheduledByUserFailed,
  GetPostsScheduledByUserRequestBody,
  handleGetPostsScheduledByUser,
  GetPostsScheduledByUserSuccess,
} from "./handleGetPostsScheduledByUser";
import {
  SharePostFailed,
  handleSharePost,
  SharePostRequestBody,
  SharePostSuccess,
} from "./handleSharePost";
import {
  UpdatePostFailed,
  handleUpdatePost,
  UpdatePostSuccess,
  UpdatePostRequestBody,
} from "./handleUpdatePost";
import {
  GetPostsByUsernameFailed,
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
  ): Promise<SecuredHTTPResponse<CreatePostFailed, CreatePostSuccess>> {
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
  ): Promise<SecuredHTTPResponse<SharePostFailed, SharePostSuccess>> {
    return await handleSharePost({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("getPostById")
  public async getPostById(
    @Request() request: express.Request,
    @Body() requestBody: GetPostByIdRequestBody,
  ): Promise<SecuredHTTPResponse<GetPostByIdFailed, GetPostByIdSuccess>> {
    return await handleGetPostById({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPostsByUserId")
  public async getPostsByUserId(
    @Request() request: express.Request,
    @Body() requestBody: GetPostsByUserIdRequestBody,
  ): Promise<SecuredHTTPResponse<GetPostsByUsernameFailed, GetPostsByUsernameSuccess>> {
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
  ): Promise<SecuredHTTPResponse<GetPostsByUsernameFailed, GetPostsByUsernameSuccess>> {
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
  ): Promise<SecuredHTTPResponse<GetPageOfSavedPostsFailed, GetPageOfSavedPostsSuccess>> {
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
  ): Promise<SecuredHTTPResponse<UpdatePostFailed, UpdatePostSuccess>> {
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