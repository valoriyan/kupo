import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ShopItemController } from "./shopItemController";
import { v4 as uuidv4 } from "uuid";
import { Promise as BluebirdPromise } from "bluebird";
import { uploadMediaFile } from "../utilities/uploadMediaFile";

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
  expirationTimestamp?: number;
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
      fileTemporaryUrl: string;
      mimetype: string;
    }> => {
      const { blobFileKey, fileTemporaryUrl, mimetype } = await uploadMediaFile({
        file: mediaFile,
        blobStorageService: controller.blobStorageService,
      });

      return {
        shopItemId,
        shopItemElementIndex: index,
        blobFileKey,
        fileTemporaryUrl,
        mimetype,
      };
    },
  );

  await controller.databaseService.tableNameToServicesMap.shopItemMediaElementTableService.createShopItemMediaElements(
    {
      shopItemMediaElements: shopItemMediaElements.map(
        ({ shopItemId, shopItemElementIndex, blobFileKey, mimetype }) => ({
          shopItemId,
          shopItemElementIndex,
          blobFileKey,
          mimetype,
        }),
      ),
    },
  );

  await controller.databaseService.tableNameToServicesMap.shopItemTableService.createShopItem(
    {
      shopItemId,
      authorUserId: clientUserId,
      caption: requestBody.caption,
      title: requestBody.title,
      price: requestBody.price,
      scheduledPublicationTimestamp: requestBody.scheduledPublicationTimestamp,
      expirationTimestamp: requestBody.expirationTimestamp,
    },
  );

  return {};
}
