import {
  Controller,
  FormField,
  Post,
  Route,
  Request,
  UploadedFiles,
  Body,
  Delete,
} from "tsoa";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import {
  FailedToCreatePostResponse,
  handleCreatePost,
  SuccessfulPostCreationResponse,
} from "./handleCreatePost";
import express from "express";
import {
  FailedtoGetPageOfPostsPaginationResponse,
  GetPageOfPostsPaginationParams,
  handleGetPageOfPostsPagination,
  SuccessfulGetPageOfPostsPaginationResponse,
} from "./pagination/handleGetPageOfPostsPagination";
import {
  FailedToUpdatePostResponse,
  handleUpdatePost,
  SuccessfulPostUpdateResponse,
  UpdatePostParams,
} from "./handleUpdatePost";
import {
  DeletePostRequestBody,
  FailedToDeletePostResponse,
  handleDeletePost,
  SuccessfulPostDeletionResponse,
} from "./handleDeletePost";
import {
  FailedToGetPostsScheduledByUserResponse,
  GetPostsScheduledByUserParams,
  handleGetPostsScheduledByUser,
  SuccessfulGetPostsScheduledByUserResponse,
} from "./handleGetPostsScheduledByUser";
import { WebSocketService } from "../../services/webSocketService";
import { BlobStorageService } from "../../services/blobStorageService";
import {
  FailedToSharePostResponse,
  handleSharePost,
  SharePostRequestBody,
  SuccessfullySharedPostResponse,
} from "./handleSharePost";
import {
  FailedToGetPostByIdResponse,
  GetPostByIdRequestBody,
  handleGetPostById,
  SuccessfullyGotPostByIdResponse,
} from "./handleGetPostById";

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
    SecuredHTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>
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
    SecuredHTTPResponse<FailedToSharePostResponse, SuccessfullySharedPostResponse>
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

  @Post("getPostById")
  public async getPostById(
    @Request() request: express.Request,
    @Body() requestBody: GetPostByIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<FailedToGetPostByIdResponse, SuccessfullyGotPostByIdResponse>
  > {
    return await handleGetPostById({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPageOfPostsPagination")
  public async getPageOfPostsPagination(
    @Request() request: express.Request,
    @Body() requestBody: GetPageOfPostsPaginationParams,
  ): Promise<
    SecuredHTTPResponse<
      FailedtoGetPageOfPostsPaginationResponse,
      SuccessfulGetPageOfPostsPaginationResponse
    >
  > {
    return await handleGetPageOfPostsPagination({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getPostsScheduledByUser")
  public async getPostsScheduledByUser(
    @Request() request: express.Request,
    @Body() requestBody: GetPostsScheduledByUserParams,
  ): Promise<
    SecuredHTTPResponse<
      FailedToGetPostsScheduledByUserResponse,
      SuccessfulGetPostsScheduledByUserResponse
    >
  > {
    return await handleGetPostsScheduledByUser({
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
    @Body() requestBody: UpdatePostParams,
  ): Promise<
    SecuredHTTPResponse<FailedToUpdatePostResponse, SuccessfulPostUpdateResponse>
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
  ): Promise<
    SecuredHTTPResponse<FailedToDeletePostResponse, SuccessfulPostDeletionResponse>
  > {
    return await handleDeletePost({
      controller: this,
      request,
      requestBody,
    });
  }
}
