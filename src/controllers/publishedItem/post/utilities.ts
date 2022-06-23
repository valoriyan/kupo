import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { RenderablePost, RootRenderablePost, SharedRenderablePost } from "./models";
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
  const {
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    idOfPublishedItemBeingShared,
  } = uncompiledBasePublishedItem;

  if (!idOfPublishedItemBeingShared) {
    const rootRenderablePost: RootRenderablePost = await assembleRootRenderablePost({
      blobStorageService,
      databaseService,
      uncompiledBasePublishedItem,
      clientUserId,    
    });

    return rootRenderablePost;
  } else {
    const uncompiledSharedBasePublishedItem = await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById({
      id:idOfPublishedItemBeingShared
    });

    const sharedRootRenderablePost: RootRenderablePost = await assembleRootRenderablePost({
      blobStorageService,
      databaseService,
      uncompiledBasePublishedItem: uncompiledSharedBasePublishedItem,
      clientUserId,    
    });


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
      likes: {
        count: countOfLikesOnPost,
      },
      comments: {
        count: countOfCommentsOnPost,
      },
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

  const mediaElements = await assemblePostMediaElements({
    publishedItemId: id,
    blobStorageService,
    databaseService,
    });

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
    likes: {
      count: countOfLikesOnPost,
    },
    comments: {
      count: countOfCommentsOnPost,
    },
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
  blobStorageService: BlobStorageServiceInterface,
  databaseService: DatabaseService,
}) {
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
