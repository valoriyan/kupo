import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { RootRenderablePost } from "./models";
import { Promise as BluebirdPromise } from "bluebird";
import { MediaElement } from "../../models";
import { PublishedItemType, UncompiledBasePublishedItem } from "../models";

export async function constructRenderablePostsFromParts({
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  clientUserId: string | undefined;
}): Promise<RootRenderablePost[]> {
  const renderablePosts = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await constructRenderablePostFromParts({
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        clientUserId,
      }),
  );

  return renderablePosts;
}

export async function constructRenderablePostFromParts({
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<RootRenderablePost> {
  const {
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = uncompiledBasePublishedItem;

  const filedPostMediaElements =
    await databaseService.tableNameToServicesMap.postContentElementsTableService.getPostContentElementsByPostId(
      {
        postId: id,
      },
    );

  const mediaElements: MediaElement[] = await BluebirdPromise.map(
    filedPostMediaElements,
    async (filedPostMediaElement): Promise<MediaElement> => {
      const fileTemporaryUrl = await blobStorageService.getTemporaryImageUrl({
        blobItemPointer: {
          fileKey: filedPostMediaElement.blobFileKey,
        },
      });

      return {
        temporaryUrl: fileTemporaryUrl,
        mimeType: filedPostMediaElement.mimeType,
      };
    },
  );

  const hashtags =
    await databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsForPublishedItemId(
      { publishedItemId: id },
    );

  const countOfLikesOnPost =
    await databaseService.tableNameToServicesMap.postLikesTableService.countLikesOnPostId(
      {
        postId: id,
      },
    );

  const countOfCommentsOnPost =
    await databaseService.tableNameToServicesMap.postCommentsTableService.countCommentsOnPostId(
      {
        postId: id,
      },
    );

  const isLikedByClient =
    !!clientUserId &&
    (await databaseService.tableNameToServicesMap.postLikesTableService.doesUserIdLikePostId(
      {
        userId: clientUserId,
        postId: id,
      },
    ));

  const isSavedByClient =
    !!clientUserId &&
    (await databaseService.tableNameToServicesMap.savedItemsTableService.doesUserIdSavePublishedItemId(
      {
        userId: clientUserId,
        publishedItemId: id,
      },
    ));

  return {
    id,
    type: PublishedItemType.POST,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    mediaElements,
    hashtags,
    likes: {
      count: countOfLikesOnPost,
    },
    comments: {
      count: countOfCommentsOnPost,
    },
    isLikedByClient,
    isSavedByClient,
  };
}

export function mergeArraysOfUncompiledBasePublishedItem({
  arrays,
}: {
  arrays: UncompiledBasePublishedItem[][];
}) {
  const mergedArray: UncompiledBasePublishedItem[] = [];
  const setOfIncludedPublishedItemIds = new Set();

  arrays.forEach((array) => {
    array.forEach((element) => {
      const { id } = element;
      if (!setOfIncludedPublishedItemIds.has(id)) {
        setOfIncludedPublishedItemIds.add(id);
        mergedArray.push(element);
      }
    });
  });

  return mergedArray;
}
