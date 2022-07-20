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
import { assembleBaseRenderablePublishedItem } from "../utilities/constructPublishedItemsFromParts";
import { Controller } from "tsoa";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";

export async function constructRenderablePostFromPartsById({
  controller,
  blobStorageService,
  databaseService,
  publishedItemId,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  publishedItemId: string;
  clientUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePost>> {
  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );

  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  const constructRenderablePostFromPartsResponse = await constructRenderablePostFromParts(
    {
      controller,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
      uncompiledBasePublishedItem,
      clientUserId,
    },
  );
  if (constructRenderablePostFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostFromPartsResponse;
  }
  const { success: post } = constructRenderablePostFromPartsResponse;

  return Success(post);
}

export async function constructRenderablePostsFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  clientUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePost[]>> {
  const constructRenderablePostFromPartsResponses = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await constructRenderablePostFromParts({
        controller,
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        clientUserId,
      }),
  );

  return collectMappedResponses({
    mappedResponses: constructRenderablePostFromPartsResponses,
  });
}

export async function constructRenderablePostFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePost>> {
  const assembleBaseRenderablePublishedItemResponse =
    await assembleBaseRenderablePublishedItem({
      controller,
      databaseService,
      uncompiledBasePublishedItem,
      clientUserId,
    });
  if (assembleBaseRenderablePublishedItemResponse.type === EitherType.failure) {
    return assembleBaseRenderablePublishedItemResponse;
  }
  const { success: baseRenderablePublishedItem } =
    assembleBaseRenderablePublishedItemResponse;

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
    console.log(`HIT!: ${caption}`);
    const assembleRootRenderablePostResponse = await assembleRootRenderablePost({
      controller,
      blobStorageService,
      databaseService,
      baseRenderablePublishedItem,
    });
    if (assembleRootRenderablePostResponse.type === EitherType.failure) {
      return assembleRootRenderablePostResponse;
    }
    const { success: rootRenderablePost } = assembleRootRenderablePostResponse;

    return Success(rootRenderablePost);
  } else {
    const getPublishedItemByIdResponse =
      await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
        {
          controller,
          id: idOfPublishedItemBeingShared,
        },
      );
    if (getPublishedItemByIdResponse.type === EitherType.failure) {
      return getPublishedItemByIdResponse;
    }
    const { success: uncompiledSharedBasePublishedItem } = getPublishedItemByIdResponse;

    const assembleBaseRenderablePublishedItemResponse =
      await assembleBaseRenderablePublishedItem({
        controller,
        databaseService,
        uncompiledBasePublishedItem: uncompiledSharedBasePublishedItem,
        clientUserId,
      });
    if (assembleBaseRenderablePublishedItemResponse.type === EitherType.failure) {
      return assembleBaseRenderablePublishedItemResponse;
    }
    const { success: sharedBaseRenderablePublishedItem } =
      assembleBaseRenderablePublishedItemResponse;

    const assembleRootRenderablePostResponse = await assembleRootRenderablePost({
      controller,
      blobStorageService,
      databaseService,
      baseRenderablePublishedItem: sharedBaseRenderablePublishedItem,
    });

    if (assembleRootRenderablePostResponse.type === EitherType.failure) {
      return assembleRootRenderablePostResponse;
    }
    const { success: sharedRootRenderablePost } = assembleRootRenderablePostResponse;

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
    return Success(sharedRenderablePost);
  }
}

async function assembleRootRenderablePost({
  controller,
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RootRenderablePost>> {
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

  const assemblePostMediaElementsResponse = await assemblePostMediaElements({
    controller,
    publishedItemId: id,
    blobStorageService,
    databaseService,
  });
  if (assemblePostMediaElementsResponse.type === EitherType.failure) {
    return assemblePostMediaElementsResponse;
  }
  const { success: mediaElements } = assemblePostMediaElementsResponse;

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

  return Success(rootRenderablePost);
}

export async function assemblePostMediaElements({
  controller,
  publishedItemId,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  publishedItemId: string;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, MediaElement[]>> {
  const getPostContentElementsByPostIdResponse =
    await databaseService.tableNameToServicesMap.postContentElementsTableService.getPostContentElementsByPostId(
      {
        controller,
        postId: publishedItemId,
      },
    );
  if (getPostContentElementsByPostIdResponse.type === EitherType.failure) {
    return getPostContentElementsByPostIdResponse;
  }
  const { success: filedPostMediaElements } = getPostContentElementsByPostIdResponse;

  const getTemporaryImageUrlResponses = await BluebirdPromise.map(
    filedPostMediaElements,
    async (
      filedPostMediaElement,
    ): Promise<InternalServiceResponse<ErrorReasonTypes<string>, MediaElement>> => {
      const getTemporaryImageUrlResponse = await blobStorageService.getTemporaryImageUrl({
        controller,
        blobItemPointer: {
          fileKey: filedPostMediaElement.blobFileKey,
        },
      });
      if (getTemporaryImageUrlResponse.type === EitherType.failure) {
        return getTemporaryImageUrlResponse;
      }
      const { success: fileTemporaryUrl } = getTemporaryImageUrlResponse;

      return Success({
        temporaryUrl: fileTemporaryUrl,
        mimeType: filedPostMediaElement.mimeType,
      });
    },
  );

  const mappedGetTemporaryImageUrlResponses = collectMappedResponses({
    mappedResponses: getTemporaryImageUrlResponses,
  });
  if (mappedGetTemporaryImageUrlResponses.type === EitherType.failure) {
    return mappedGetTemporaryImageUrlResponses;
  }
  const { success: mediaElements } = mappedGetTemporaryImageUrlResponses;

  return Success(mediaElements);
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
