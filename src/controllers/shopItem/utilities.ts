import { BlobStorageServiceInterface } from "./../../services/blobStorageService/models";
import { DatabaseService } from "../../services/databaseService";
import { Promise as BluebirdPromise } from "bluebird";
import { RenderableShopItemPreview, UnrenderableShopItemPreview } from "./models";
import { MediaElement } from "../models";

export async function constructRenderableShopItemPreviewsFromParts({
  blobStorageService,
  databaseService,
  unrenderableShopItemPreviews,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderableShopItemPreviews: UnrenderableShopItemPreview[];
  clientUserId: string | undefined;
}): Promise<RenderableShopItemPreview[]> {
  const renderablePosts = await BluebirdPromise.map(
    unrenderableShopItemPreviews,
    async (unrenderableShopItemPreview) =>
      await constructRenderableShopItemPreviewFromParts({
        blobStorageService,
        databaseService,
        unrenderableShopItemPreview,
        clientUserId,
      }),
  );

  return renderablePosts;
}

export async function constructRenderableShopItemPreviewFromParts({
  blobStorageService,
  databaseService,
  unrenderableShopItemPreview,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderableShopItemPreview: UnrenderableShopItemPreview;
  clientUserId: string | undefined;
}): Promise<RenderableShopItemPreview> {
  const renderableShopItemPreview = await assembleShopItemPreviewComponents({
    blobStorageService,
    databaseService,
    unrenderableShopItemPreview,
    clientUserId,
  });

  return renderableShopItemPreview;
}

async function assembleShopItemPreviewComponents({
  blobStorageService,
  databaseService,
  unrenderableShopItemPreview,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderableShopItemPreview: UnrenderableShopItemPreview;
  clientUserId: string | undefined;
}): Promise<RenderableShopItemPreview> {
  const {
    shopItemId,
    authorUserId,
    description,
    creationTimestamp,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title,
    price,
  } = unrenderableShopItemPreview;

  const filedShopItemMediaElements =
    await databaseService.tableNameToServicesMap.shopItemMediaElementTableService.getShopItemMediaElementsByShopItemId(
      {
        shopItemId,
      },
    );

  const mediaElements: MediaElement[] = await BluebirdPromise.map(
    filedShopItemMediaElements,
    async (filedShopItemMediaElement): Promise<MediaElement> => {
      const { blobFileKey, mimeType } = filedShopItemMediaElement;

      const fileTemporaryUrl = await blobStorageService.getTemporaryImageUrl({
        blobItemPointer: {
          fileKey: blobFileKey,
        },
      });

      return {
        temporaryUrl: fileTemporaryUrl,
        mimeType: mimeType,
      };
    },
  );

  const hashtags =
    await databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsForShopItemId(
      { shopItemId },
    );

  return {
    shopItemId,
    authorUserId,
    description,
    creationTimestamp,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title,
    price,
    hashtags,
    mediaElements,
  };
}
