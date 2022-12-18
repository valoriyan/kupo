import express from "express";
import { WebSocketService } from "../../../services/webSocketService";
import { Body, Controller, Delete, Post, Request, Route } from "tsoa";
import { injectable } from "tsyringe";
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { PaymentProcessingService } from "../../../services/paymentProcessingService";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../../utilities/monads";
import {
  CreateShopItemFailedReason,
  CreateShopItemRequestBody,
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
  UpdateShopItemRequestBody,
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
import { EmailService } from "../../../services/emailService";
import { FastCacheService } from "../../../services/fastCacheService";

@injectable()
@Route("shopitem")
export class ShopItemController extends Controller {
  constructor(
    public emailService: EmailService,
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
    public paymentProcessingService: PaymentProcessingService,
    public webSocketService: WebSocketService,
    public fastCacheService: FastCacheService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("create")
  public async createShopItem(
    @Request() request: express.Request,
    @Body() requestBody: CreateShopItemRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | CreateShopItemFailedReason>,
      CreateShopItemSuccess
    >
  > {
    return await handleCreateShopItem({
      controller: this,
      request,
      requestBody,
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
    @Body() requestBody: UpdateShopItemRequestBody,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UpdateShopItemFailedReason>,
      UpdateShopItemSuccess
    >
  > {
    return await handleUpdateShopItem({
      controller: this,
      request,
      requestBody,
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
