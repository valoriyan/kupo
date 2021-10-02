import { Controller, FormField, Post, Route, Request, UploadedFiles, Body } from "tsoa";
import { HTTPResponse, SecuredHTTPResponse } from "../../types/httpResponse";
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
    @FormField() authorUserId: string,
    @FormField() title: string,
    @FormField() price: number,
    // @FormField() collaboratorUsernames: string[],
    @FormField() scheduledPublicationTimestamp: number,
    // Within all the files uploaded, what is the index of each uploaded image
    @FormField() indexesOfUploadedImages: number[],
    // Within all the files uploaded, what is the index of each uploaded video
    @FormField() indexesOfUploadedVideos: number[],
    @UploadedFiles() images: Express.Multer.File[],
    @UploadedFiles() videos: Express.Multer.File[],
  ): Promise<HTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>> {
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
        title,
        price,
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
}
