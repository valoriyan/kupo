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
import { PaymentProcessingService } from "../../../services/paymentProcessingService";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../../utilities/monads";
import {
  CreateShopItemFailedReason,
  CreateShopItemSuccess,
  handleCreateShopItem,
} from "./handleCreateShopItem";
import {
  DeleteShopItemFailedReason,
  DeleteShopItemRequestBody,
  DeleteShopItemSuccess,
  handleDeleteShopItem,
} from "./handleDeleteShopItem";
import {
  handleUpdateShopItem,
  UpdateShopItemFailedReason,
  UpdateShopItemSuccess,
} from "./handleUpdateShopItem";
import {
  GetCreditCardsStoredByUserIdFailedReason,
  GetCreditCardsStoredByUserIdSuccess,
  handleGetCreditCardsStoredByUserId,
} from "./payments/getCreditCardsStoredByUserId";
import {
  handlePurchaseShopItem,
  PurchaseShopItemFailedReason,
  PurchaseShopItemRequestBody,
  PurchaseShopItemSuccess,
} from "./payments/handlePurchaseShopItem";
import {
  handleMakeCreditCardPrimary,
  MakeCreditCardPrimaryFailedReason,
  MakeCreditCardPrimaryRequestBody,
  MakeCreditCardPrimarySuccess,
} from "./payments/makeCreditCardPrimary";
import {
  handleRemoveCreditCard,
  RemoveCreditCardFailedReason,
  RemoveCreditCardRequestBody,
  RemoveCreditCardSuccess,
} from "./payments/removeCreditCard";
import {
  handleStoreCreditCard,
  StoreCreditCardFailedReason,
  StoreCreditCardRequestBody,
  StoreCreditCardSuccess,
} from "./payments/storeCreditCard";

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
    @UploadedFiles() combinedMediaFiles: Express.Multer.File[],
    // @FormField() only supports strings so we'll have to do some parsing
    // for the following fields
    @FormField() numberOfPurchasedMediaFiles: string, // number
    @FormField() caption: string,
    @FormField() hashtags: string, // split by " "
    @FormField() title: string,
    @FormField() price: string,
    @FormField() scheduledPublicationTimestamp: string,
    @FormField() collaboratorUserIds: string,
    @FormField() expirationTimestamp?: string, // number
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | CreateShopItemFailedReason>,
      CreateShopItemSuccess
    >
  > {
    const splitMediaIndex =
      combinedMediaFiles.length - Number.parseInt(numberOfPurchasedMediaFiles, 10);

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
        mediaFiles: combinedMediaFiles.slice(0, splitMediaIndex),
        purchasedMediaFiles: combinedMediaFiles.slice(splitMediaIndex),
      },
    });
  }

  @Post("purchaseShopItem")
  public async purchaseShopItem(
    @Request() request: express.Request,
    @Body() requestBody: PurchaseShopItemRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | PurchaseShopItemFailedReason>,
      PurchaseShopItemSuccess
    >
  > {
    return await handlePurchaseShopItem({
      controller: this,
      request,
      requestBody,
    });
  }

  @Post("storeCreditCard")
  public async storeCreditCard(
    @Request() request: express.Request,
    @Body() requestBody: StoreCreditCardRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | StoreCreditCardFailedReason>,
      StoreCreditCardSuccess
    >
  > {
    return await handleStoreCreditCard({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("getCreditCardsStoredByUserId")
  public async getCreditCardsStoredByUserId(
    @Request() request: express.Request,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | GetCreditCardsStoredByUserIdFailedReason>,
      GetCreditCardsStoredByUserIdSuccess
    >
  > {
    return await handleGetCreditCardsStoredByUserId({
      controller: this,
      request,
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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdateShopItemFailedReason>,
      UpdateShopItemSuccess
    >
  > {
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

  @Delete("makeCardPrimary")
  public async makeCardPrimary(
    @Request() request: express.Request,
    @Body() requestBody: MakeCreditCardPrimaryRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | MakeCreditCardPrimaryFailedReason>,
      MakeCreditCardPrimarySuccess
    >
  > {
    return await handleMakeCreditCardPrimary({
      controller: this,
      request,
      requestBody,
    });
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Delete("delete")
  public async deleteShopItem(
    @Request() request: express.Request,
    @Body() requestBody: DeleteShopItemRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | DeleteShopItemFailedReason>,
      DeleteShopItemSuccess
    >
  > {
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
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | RemoveCreditCardFailedReason>,
      RemoveCreditCardSuccess
    >
  > {
    return await handleRemoveCreditCard({
      controller: this,
      request,
      requestBody,
    });
  }
}
