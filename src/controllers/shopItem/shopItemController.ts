import { Controller, FormField, Post, Route, Request, UploadedFiles } from "tsoa";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { injectable } from "tsyringe";
import { BlobStorageService } from "../../services/blobStorageService";
import { DatabaseService } from "../../services/databaseService";
import express from "express";
import {
  FailedToCreateShopItemResponse,
  handleCreateShopItem,
  SuccessfulShopItemCreationResponse,
} from "./handleCreateShopItem";
import { FailedToUpdateShopItemResponse, handleUpdateShopItem, SuccessfulShopItemUpdateResponse } from "./handleUpdateShopItem";

@injectable()
@Route("shopitem")
export class ShopItemController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  @Post("create")
  public async createShopItem(
    @Request() request: express.Request,
    @FormField() caption: string,
    @FormField() hashtags: string[],
    @FormField() title: string,
    @FormField() price: number,
    @FormField() scheduledPublicationTimestamp: number,
    @FormField() expirationTimestamp: number,
    @FormField() collaboratorUserIds: string[],
    @UploadedFiles() mediaFiles: Express.Multer.File[],
  ): Promise<
    SecuredHTTPResponse<
      FailedToCreateShopItemResponse,
      SuccessfulShopItemCreationResponse
    >
  > {
    return await handleCreateShopItem({
      controller: this,
      request,
      requestBody: {
        caption,
        hashtags,
        title,
        price,
        scheduledPublicationTimestamp,
        expirationTimestamp,
        collaboratorUserIds,
        mediaFiles,
      },
    });
  }

  @Post("update")
  public async updateShopItem(
    @Request() request: express.Request,
    @FormField() caption?: string,
    @FormField() hashtags?: string[],
    @FormField() title?: string,
    @FormField() price?: number,
    @FormField() scheduledPublicationTimestamp?: number,
    @FormField() expirationTimestamp?: number,
    @FormField() collaboratorUserIds?: string[],
    @UploadedFiles() mediaFiles?: Express.Multer.File[],
  ): Promise<
    SecuredHTTPResponse<
      FailedToUpdateShopItemResponse,
      SuccessfulShopItemUpdateResponse
    >
  > {
    return await handleUpdateShopItem({
      controller: this,
      request,
      requestBody: {
        caption,
        hashtags,
        title,
        price,
        scheduledPublicationTimestamp,
        expirationTimestamp,
        collaboratorUserIds,
        mediaFiles,
      },
    });
  }

}
