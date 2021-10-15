import express from "express";
import { HTTPResponse } from "src/types/httpResponse";
import { ShopItemController } from "./shopItemController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulShopItemCreationResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToCreateShopItemResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HandlerRequestBody {
  caption: string;
  hashtags: string[];
  title: string;
  price: number;
  scheduledPublicationTimestamp: number;
  expirationTimestamp: number;
  collaboratorUserIds: string[];
  mediaFiles: Express.Multer.File[];
}

export async function handleCreateShopItem({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: HandlerRequestBody;
}): Promise<
  HTTPResponse<FailedToCreateShopItemResponse, SuccessfulShopItemCreationResponse>
> {
  console.log("controller", controller);
  console.log("request", request);
  console.log("requestBody", requestBody);

  return {};
}
