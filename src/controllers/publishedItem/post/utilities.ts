import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { RenderablePost, RootRenderablePost, SharedRenderablePost } from "./models";
import { Promise as BluebirdPromise } from "bluebird";
import { MediaElement } from "../../models";
import {
  BaseRenderablePublishedItem,
  PublishedItemType,
  UncompiledBasePublishedItem,
} from "../models";
import { assembleBaseRenderablePublishedItem } from "../utilities";

export async function constructRenderablePostFromPartsById({
  blobStorageService,
  databaseService,
  publishedItemId,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  publishedItemId: string;
  clientUserId: string | undefined;
}): Promise<RenderablePost> {

  const uncompiledBasePublishedItem =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { id: publishedItemId },
    );

    const post = await constructRenderablePostFromParts({
      blobStorageService: blobStorageService,
      databaseService: databaseService,
      uncompiledBasePublishedItem,
      clientUserId,
    });

    return post;
}

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
}): Promise<RenderablePost[]> {
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
}): Promise<RenderablePost> {
  const baseRenderablePublishedItem = await assembleBaseRenderablePublishedItem({
    databaseService,
    uncompiledBasePublishedItem,
    clientUserId,
  });

  const {
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    idOfPublishedItemBeingShared,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
  } = baseRenderablePublishedItem;

  if (!idOfPublishedItemBeingShared) {
    const rootRenderablePost: RootRenderablePost = await assembleRootRenderablePost({
      blobStorageService,
      databaseService,
      baseRenderablePublishedItem,
    });

    return rootRenderablePost;
  } else {
    const uncompiledSharedBasePublishedItem =
      await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
        {
          id: idOfPublishedItemBeingShared,
        },
      );

    const sharedBaseRenderablePublishedItem = await assembleBaseRenderablePublishedItem({
      databaseService,
      uncompiledBasePublishedItem: uncompiledSharedBasePublishedItem,
      clientUserId,
    });

    const sharedRootRenderablePost: RootRenderablePost = await assembleRootRenderablePost(
      {
        blobStorageService,
        databaseService,
        baseRenderablePublishedItem: sharedBaseRenderablePublishedItem,
      },
    );

    const sharedRenderablePost: SharedRenderablePost = {
      type: PublishedItemType.POST,
      id,
      authorUserId,
      caption,
      creationTimestamp,
      scheduledPublicationTimestamp,
      expirationTimestamp,
      idOfPublishedItemBeingShared,
      hashtags,
      likes,
      comments,
      isLikedByClient,
      isSavedByClient,
      sharedItem: sharedRootRenderablePost,
    };
    return sharedRenderablePost;
  }
}

async function assembleRootRenderablePost({
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
}): Promise<RootRenderablePost> {
  const {
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
  } = baseRenderablePublishedItem;

  const mediaElements = await assemblePostMediaElements({
    publishedItemId: id,
    blobStorageService,
    databaseService,
  });

  const rootRenderablePost: RootRenderablePost = {
    type: PublishedItemType.POST,
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    mediaElements,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
  };

  return rootRenderablePost;
}

export async function assemblePostMediaElements({
  publishedItemId,
  blobStorageService,
  databaseService,
}: {
  publishedItemId: string;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<MediaElement[]> {
  const filedPostMediaElements =
    await databaseService.tableNameToServicesMap.postContentElementsTableService.getPostContentElementsByPostId(
      {
        postId: publishedItemId,
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

  return mediaElements;
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
