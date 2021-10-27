import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ShopItemController } from "./shopItemController";
import { v4 as uuidv4 } from "uuid";
import { Promise as BluebirdPromise } from "bluebird";

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
  collaboratorUserIds?: string[];
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
  SecuredHTTPResponse<FailedToCreateShopItemResponse, SuccessfulShopItemCreationResponse>
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const shopItemId = uuidv4();

  const shopItemMediaElements = await BluebirdPromise.map(
    requestBody.mediaFiles,
    async (
      mediaFile,
      index,
    ): Promise<{
      shopItemId: string;
      shopItemElementIndex: number;
      blobFileKey: string;
    }> => {
      const blobItemPointer = await controller.blobStorageService.saveImage({
        image: mediaFile.buffer,
      });

      return {
        shopItemId,
        shopItemElementIndex: index,
        blobFileKey: blobItemPointer.fileKey,
      };
    },
  );

  await controller.databaseService.tableServices.shopItemMediaElementTableService.createShopItemMediaElements(
    {
      shopItemMediaElements,
    },
  );

  await controller.databaseService.tableServices.shopItemTableService.createShopItem({
    shopItemId,
    authorUserId: clientUserId,
    caption: requestBody.caption,
    title: requestBody.title,
    price: requestBody.price,
    scheduledPublicationTimestamp: requestBody.scheduledPublicationTimestamp,
    expirationTimestamp: requestBody.expirationTimestamp,
  });

  return {};
}
