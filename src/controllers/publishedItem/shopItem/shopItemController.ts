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
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../../services/databaseService";
import express from "express";
import {
  CreateShopItemFailedReason,
  handleCreateShopItem,
  CreateShopItemSuccess,
} from "./handleCreateShopItem";
import {
  UpdateShopItemFailedReason,
  handleUpdateShopItem,
  UpdateShopItemSuccess,
} from "./handleUpdateShopItem";
import {
  DeleteShopItemRequestBody,
  DeleteShopItemFailed,
  handleDeleteShopItem,
  DeleteShopItemSuccess,
} from "./handleDeleteShopItem";
import { BlobStorageService } from "../../../services/blobStorageService";
import {
  GetShopItemsByUserIdRequestBody,
  GetShopItemsByUsernameFailedReason,
  GetShopItemsByUsernameRequestBody,
  GetShopItemsByUsernameSuccess,
  handleGetShopItemsByUserId,
  handleGetShopItemsByUsername,
} from "./handleGetShopItems";
import { PaymentProcessingService } from "../../../services/paymentProcessingService";
import {
  handlePurchaseShopItem,
  PurchaseShopItemFailedReason,
  PurchaseShopItemRequestBody,
  PurchaseShopItemSuccess,
} from "./payments/handlePurchaseShopItem";
import {
  GetCreditCardsStoredByUserIdFailed,
  GetCreditCardsStoredByUserIdRequestBody,
  GetCreditCardsStoredByUserIdSuccess,
  handleGetCreditCardsStoredByUserId,
} from "./payments/getCreditCardsStoredByUserId";
import {
  handleRemoveCreditCard,
  RemoveCreditCardFailedReason,
  RemoveCreditCardRequestBody,
  RemoveCreditCardSuccess,
} from "./payments/removeCreditCard";

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
    @FormField() caption: string,
    @FormField() hashtags: string, // split by " "
    @FormField() title: string,
    // @FormField() only supports strings so we'll have to do some parsing
    // for the following fields
    @FormField() price: string,
    @FormField() scheduledPublicationTimestamp: string,
    @FormField() collaboratorUserIds: string,
    @FormField() expirationTimestamp?: string, // number
  ): Promise<SecuredHTTPResponse<CreateShopItemFailedReason, CreateShopItemSuccess>> {
    return await handleCreateShopItem({
      controller: this,
      request,
      requestBody: {
        caption,
        hashtags: JSON.parse(hashtags),
        title,
        price: parseInt(price, 10),
        scheduledPublicationTimestamp: scheduledPublicationTimestamp
          ? parseInt(scheduledPublicationTimestamp, 10)
          : undefined,
        expirationTimestamp: expirationTimestamp
          ? parseInt(expirationTimestamp, 10)
          : undefined,
        collaboratorUserIds: JSON.parse(collaboratorUserIds),
        mediaFiles,
      },
    });
  }

  @Post("purchaseShopItem")
  public async purchaseShopItem(
    @Request() request: express.Request,
    @Body() requestBody: PurchaseShopItemRequestBody,
  ): Promise<SecuredHTTPResponse<PurchaseShopItemFailedReason, PurchaseShopItemSuccess>> {
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
    SecuredHTTPResponse<GetShopItemsByUsernameFailedReason, GetShopItemsByUsernameSuccess>
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
    SecuredHTTPResponse<GetShopItemsByUsernameFailedReason, GetShopItemsByUsernameSuccess>
  > {
    return await handleGetShopItemsByUsername({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("getCreditCardsStoredByUserId")
  public async getCreditCardsStoredByUserId(
    @Request() request: express.Request,
    @Body() requestBody: GetCreditCardsStoredByUserIdRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      GetCreditCardsStoredByUserIdFailed,
      GetCreditCardsStoredByUserIdSuccess
    >
  > {
    return await handleGetCreditCardsStoredByUserId({
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
    @FormField() publishedItemId: string,
    @FormField() description?: string,
    @FormField() hashtags?: string[],
    @FormField() title?: string,
    @FormField() price?: number,
    @FormField() scheduledPublicationTimestamp?: number,
    @FormField() expirationTimestamp?: number,
    @FormField() collaboratorUserIds?: string[],
    @UploadedFiles() mediaFiles?: Express.Multer.File[],
  ): Promise<SecuredHTTPResponse<UpdateShopItemFailedReason, UpdateShopItemSuccess>> {
    return await handleUpdateShopItem({
      controller: this,
      request,
      requestBody: {
        publishedItemId,
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

  @Delete("removeCreditCard")
  public async removeCreditCard(
    @Request() request: express.Request,
    @Body() requestBody: RemoveCreditCardRequestBody,
  ): Promise<SecuredHTTPResponse<RemoveCreditCardFailedReason, RemoveCreditCardSuccess>> {
    return await handleRemoveCreditCard({
      controller: this,
      request,
      requestBody,
    });
  }
}
