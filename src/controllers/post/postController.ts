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
import { LocalBlobStorageService } from "../../services/blobStorageService";
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
} from "./handleUpdatePost";
import {
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

@injectable()
@Route("post")
export class PostController extends Controller {
  constructor(
    public blobStorageService: LocalBlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  @Post("create")
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

  @Post("update")
  public async updatePost(
    @Request() request: express.Request,
    @FormField() postId: string,
    @FormField() caption?: string,
    @FormField() hashtags?: string[],
    @FormField() scheduledPublicationTimestamp?: number,
    @FormField() expirationTimestamp?: number,
    @FormField() mediaBlobFileKeys?: (boolean | null)[],
    @UploadedFiles() mediaFiles?: Express.Multer.File[],
  ): Promise<
    SecuredHTTPResponse<FailedToUpdatePostResponse, SuccessfulPostUpdateResponse>
  > {
    return await handleUpdatePost({
      controller: this,
      request,
      requestBody: {
        postId,
        mediaFiles,
        mediaBlobFileKeys,
        caption,
        hashtags,
        scheduledPublicationTimestamp,
        expirationTimestamp,
      },
    });
  }

  @Delete("delete")
  public async deletePost(
    @Request() request: express.Request,
    @FormField() postId: string,
  ): Promise<
    SecuredHTTPResponse<FailedToDeletePostResponse, SuccessfulPostDeletionResponse>
  > {
    return await handleDeletePost({
      controller: this,
      request,
      requestBody: {
        postId,
      },
    });
  }
}
