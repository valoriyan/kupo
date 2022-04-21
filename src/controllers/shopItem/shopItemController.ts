import {
  Controller,
  FormField,
  Post,
  Route,
  Request,
  UploadedFiles,
  Delete,
  Body,
} from "tsoa";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";
import express from "express";
import {
  CreateShopItemFailed,
  handleCreateShopItem,
  CreateShopItemSuccess,
} from "./handleCreateShopItem";
import {
  UpdateShopItemFailed,
  handleUpdateShopItem,
  UpdateShopItemSuccess,
} from "./handleUpdateShopItem";
import {
  DeleteShopItemRequestBody,
  DeleteShopItemFailed,
  handleDeleteShopItem,
  DeleteShopItemSuccess,
} from "./handleDeleteShopItem";
import { BlobStorageService } from "./../../services/blobStorageService";

@injectable()
@Route("shopitem")
export class ShopItemController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("create")
  public async createShopItem(
    @Request() request: express.Request,
    @FormField() caption: string,
    @FormField() hashtags: string[],
    @FormField() title: string,
    @FormField() price: number,
    @FormField() scheduledPublicationTimestamp: number,
    @FormField() collaboratorUserIds: string[],
    @UploadedFiles() mediaFiles: Express.Multer.File[],
    @FormField() expirationTimestamp?: number,
  ): Promise<SecuredHTTPResponse<CreateShopItemFailed, CreateShopItemSuccess>> {
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

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("update")
  public async updateShopItem(
    @Request() request: express.Request,
    @FormField() shopItemId: string,
    @FormField() caption?: string,
    @FormField() hashtags?: string[],
    @FormField() title?: string,
    @FormField() price?: number,
    @FormField() scheduledPublicationTimestamp?: number,
    @FormField() expirationTimestamp?: number,
    @FormField() collaboratorUserIds?: string[],
    @UploadedFiles() mediaFiles?: Express.Multer.File[],
  ): Promise<SecuredHTTPResponse<UpdateShopItemFailed, UpdateShopItemSuccess>> {
    return await handleUpdateShopItem({
      controller: this,
      request,
      requestBody: {
        shopItemId,
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

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Delete("delete")
  public async deleteShopItem(
    @Request() request: express.Request,
    @Body() requestBody: DeleteShopItemRequestBody,
  ): Promise<SecuredHTTPResponse<DeleteShopItemFailed, DeleteShopItemSuccess>> {
    return await handleDeleteShopItem({
      controller: this,
      request,
      requestBody,
    });
  }
}
