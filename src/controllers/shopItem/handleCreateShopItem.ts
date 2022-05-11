import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ShopItemController } from "./shopItemController";
import { v4 as uuidv4 } from "uuid";
import { Promise as BluebirdPromise } from "bluebird";
import { uploadMediaFile } from "../utilities/mediaFiles/uploadMediaFile";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateShopItemSuccess {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateShopItemFailed {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HandlerRequestBody {
  description: string;
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
}): Promise<SecuredHTTPResponse<CreateShopItemFailed, CreateShopItemSuccess>> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const {
    description,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title,
    price,
    mediaFiles,
    hashtags,
  } = requestBody;

  const shopItemId = uuidv4();
  const creationTimestamp = Date.now();

  const shopItemMediaElements = await BluebirdPromise.map(
    mediaFiles,
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

  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToShopItem(
    {
      hashtags: lowerCaseHashtags,
      shopItemId,
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
      description: description,
      creationTimestamp,
      scheduledPublicationTimestamp: scheduledPublicationTimestamp,
      expirationTimestamp: expirationTimestamp,
      title: title,
      price: price,
    },
  );

  return {};
}
