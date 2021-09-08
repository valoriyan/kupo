import { Controller, FormField, Post, Route, UploadedFile, Request } from "tsoa";
import { HTTPResponse } from "../../types/httpResponse";
import { injectable } from "tsyringe";
import { LocalBlobStorageService } from "../../services/blobStorageService";
import { DatabaseService } from "../../services/databaseService";
import {
  FailedToCreatePostResponse,
  handleCreatePost,
  PostDurationSetting,
  PostPrivacySetting,
  SuccessfulPostCreationResponse,
} from "./handleCreatePost";
import express from "express";

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
    @FormField() caption: string,
    @FormField() creatorUserId: string,
    @FormField() visibility: PostPrivacySetting,
    @FormField() duration: PostDurationSetting,
    @FormField() title: string,
    @FormField() price: number,
    @FormField() collaboratorUsernames: string[],
    @FormField() scheduledPublicationTimestamp: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<HTTPResponse<FailedToCreatePostResponse, SuccessfulPostCreationResponse>> {
    return await handleCreatePost({
      controller: this,
      request,
      requestBody: {
        caption,
        creatorUserId,
        visibility,
        duration,
        title,
        price,
        collaboratorUsernames,
        scheduledPublicationTimestamp,
        file,
      },
    });
  }
}
