import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import { ShopItemController } from "./shopItemController";
import { v4 as uuidv4 } from "uuid";
import { Promise as BluebirdPromise } from "bluebird";
import { uploadMediaFile } from "../../utilities/mediaFiles/uploadMediaFile";
import { PublishedItemType } from "../models";
import { DBShopItemElementType } from "../../../services/databaseService/tableServices/shopItemMediaElementsTableService";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateShopItemSuccess {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateShopItemFailed {}

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
}): Promise<SecuredHTTPResponse<CreateShopItemFailed, CreateShopItemSuccess>> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const {
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title,
    price,
    mediaFiles,
    hashtags,
  } = requestBody;

  const publishedItemId = uuidv4();
  const creationTimestamp = Date.now();

  await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.createPublishedItem({
    type: PublishedItemType.SHOP_ITEM,
    publishedItemId,
    creationTimestamp,
    authorUserId: clientUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  });

  await controller.databaseService.tableNameToServicesMap.shopItemTableService.createShopItem(
    {
      publishedItemId,
      title: title,
      price: price,
    },
  );



  const shopItemMediaElements = await BluebirdPromise.map(
    mediaFiles,
    async (
      mediaFile,
      index,
    ): Promise<{
      publishedItemId: string;
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
        publishedItemId,
        shopItemElementIndex: index,
        blobFileKey,
        fileTemporaryUrl,
        mimetype,
      };
    },
  );

  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToPublishedItem(
    {
      hashtags: lowerCaseHashtags,
      publishedItemId,
    },
  );

  await controller.databaseService.tableNameToServicesMap.shopItemMediaElementTableService.createShopItemMediaElements(
    {
      shopItemMediaElements: shopItemMediaElements.map(
        ({ publishedItemId, shopItemElementIndex, blobFileKey, mimetype }) => ({
          publishedItemId,
          shopItemElementIndex,
          shopItemType: DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
          blobFileKey,
          mimetype,
        }),
      ),
    },
  );



  return {};
}
