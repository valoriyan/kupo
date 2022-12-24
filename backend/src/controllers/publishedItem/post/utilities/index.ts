import { BlobStorageService } from "../../../../services/blobStorageService";
import { DatabaseService } from "../../../../services/databaseService";
import { RenderablePost, RootRenderablePost, SharedRenderablePost } from "../models";
import { Promise as BluebirdPromise } from "bluebird";
import { PublishedItemType, UncompiledBasePublishedItem } from "../../models";
import { assembleBaseRenderablePublishedItem } from "../../utilities/assembleBaseRenderablePublishedItem";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../../utilities/monads/unwrapListOfResponses";
import { assembleRootRenderablePost } from "./assembleRootRenderablePost";
import { constructPublishedItemFromPartsById } from "../../utilities/constructPublishedItemsFromParts";

export async function constructRenderablePostsFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  requestorUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePost[]>> {
  const constructRenderablePostFromPartsResponses = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await constructRenderablePostFromParts({
        controller,
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        requestorUserId,
      }),
  );

  return unwrapListOfEitherResponses({
    eitherResponses: constructRenderablePostFromPartsResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function constructRenderablePostFromPartsById({
  controller,
  blobStorageService,
  databaseService,
  publishedItemId,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  publishedItemId: string;
  requestorUserId: string | undefined;
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
      requestorUserId,
    },
  );
  if (constructRenderablePostFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostFromPartsResponse;
  }
  const { success: post } = constructRenderablePostFromPartsResponse;

  return Success(post);
}

export async function constructRenderablePostFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  requestorUserId?: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePost>> {
  //////////////////////////////////////////////////
  // Get Base Renderable Published Item
  //////////////////////////////////////////////////
  const assembleBaseRenderablePublishedItemResponse =
    await assembleBaseRenderablePublishedItem({
      controller,
      databaseService,
      uncompiledBasePublishedItem,
      requestorUserId,
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
    //////////////////////////////////////////////////
    // If Published Item is NOT a Shared Item
    //
    //     Get Base Post
    //////////////////////////////////////////////////
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

    //////////////////////////////////////////////////
    // Return
    //////////////////////////////////////////////////

    return Success(rootRenderablePost);
  } else {
    //////////////////////////////////////////////////
    // If Published Item IS a Shared Item
    //
    //     Get Published Item Being Shared
    //////////////////////////////////////////////////

    const constructPublishedItemFromPartsByIdResponse =
      await constructPublishedItemFromPartsById({
        controller,
        blobStorageService,
        databaseService,
        publishedItemId: idOfPublishedItemBeingShared,
        requestorUserId,
      });
    if (constructPublishedItemFromPartsByIdResponse.type === EitherType.failure) {
      return constructPublishedItemFromPartsByIdResponse;
    }
    const { success: sharedRootRenderablePost } =
      constructPublishedItemFromPartsByIdResponse;

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
      sharedItem: sharedRootRenderablePost as RootRenderablePost,
    };

    //////////////////////////////////////////////////
    // Return
    //////////////////////////////////////////////////

    return Success(sharedRenderablePost);
  }
}
