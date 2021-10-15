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
import { BlobStorageService } from "../../services/blobStorageService";
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
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  @Post("create")
  public async createPost(
    @Request() request: express.Request,
    @FormField() caption: string,
    @FormField() hashtags: string[],
    @FormField() authorUserId: string,
    // @FormField() collaboratorUsernames: string[],
    @FormField() scheduledPublicationTimestamp: number,
    // Within all the files uploaded, what is the index of each uploaded image
    @FormField() indexesOfUploadedImages: number[],
    // Within all the files uploaded, what is the index of each uploaded video
    @FormField() indexesOfUploadedVideos: number[],
    @UploadedFiles() images: Express.Multer.File[],
    @UploadedFiles() videos: Express.Multer.File[],
  ): Promise<
    SecuredHTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>
  > {
    return await handleCreatePost({
      controller: this,
      request,
      requestBody: {
        authorUserId,
        images,
        videos,
        indexesOfUploadedImages,
        indexesOfUploadedVideos,
        caption,
        hashtags,
        scheduledPublicationTimestamp,
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
        caption,
        hashtags,
        scheduledPublicationTimestamp,
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
