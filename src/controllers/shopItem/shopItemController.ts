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
import {
  GetShopItemsByUserIdRequestBody,
  GetShopItemsByUsernameFailed,
  GetShopItemsByUsernameRequestBody,
  GetShopItemsByUsernameSuccess,
  handleGetShopItemsByUserId,
  handleGetShopItemsByUsername,
} from "./handleGetShopItems";
import { PaymentProcessingService } from "../../services/paymentProcessingService";
import {
  handlePurchaseShopItem,
  PurchaseShopItemFailed,
  PurchaseShopItemRequestBody,
  PurchaseShopItemSuccess,
} from "./handlePurchaseShopItem";

@injectable()
@Route("shopitem")
export class ShopItemController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
    public paymentProcessingService: PaymentProcessingService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("create")
  public async createShopItem(
    @Request() request: express.Request,
    @UploadedFiles() mediaFiles: Express.Multer.File[],
    @FormField() title: string,
    @FormField() description: string,
    // @FormField() only supports strings so we'll have to do some parsing
    // for the following fields
    @FormField() price: string, // number
    @FormField() hashtags: string, // string[]
    @FormField() collaboratorUserIds: string, // string[]
    @FormField() scheduledPublicationTimestamp?: string, // number
    @FormField() expirationTimestamp?: string, // number
  ): Promise<SecuredHTTPResponse<CreateShopItemFailed, CreateShopItemSuccess>> {
    return await handleCreateShopItem({
      controller: this,
      request,
      requestBody: {
        mediaFiles,
        title,
        description,
        price: parseInt(price, 10),
        hashtags: JSON.parse(hashtags),
        collaboratorUserIds: JSON.parse(collaboratorUserIds),
        scheduledPublicationTimestamp: scheduledPublicationTimestamp
          ? parseInt(scheduledPublicationTimestamp, 10)
          : undefined,
        expirationTimestamp: expirationTimestamp
          ? parseInt(expirationTimestamp, 10)
          : undefined,
      },
    });
  }

  @Post("purchaseShopItem")
  public async purchaseShopItem(
    @Request() request: express.Request,
    @Body() requestBody: PurchaseShopItemRequestBody,
  ): Promise<SecuredHTTPResponse<PurchaseShopItemFailed, PurchaseShopItemSuccess>> {
    return await handlePurchaseShopItem({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("getShopItemsByUserId")
  public async getShopItemsByUserId(
    @Request() request: express.Request,
    @Body() requestBody: GetShopItemsByUserIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<GetShopItemsByUsernameFailed, GetShopItemsByUsernameSuccess>
  > {
    return await handleGetShopItemsByUserId({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getShopItemsByUsername")
  public async getShopItemsByUsername(
    @Request() request: express.Request,
    @Body() requestBody: GetShopItemsByUsernameRequestBody,
  ): Promise<
    SecuredHTTPResponse<GetShopItemsByUsernameFailed, GetShopItemsByUsernameSuccess>
  > {
    return await handleGetShopItemsByUsername({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("update")
  public async updateShopItem(
    @Request() request: express.Request,
    @FormField() shopItemId: string,
    @FormField() description?: string,
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
        description,
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
