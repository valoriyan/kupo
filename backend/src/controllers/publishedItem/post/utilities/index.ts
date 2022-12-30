import { BlobStorageService } from "../../../../services/blobStorageService";
import { DatabaseService } from "../../../../services/databaseService";
import { RenderablePost, RootRenderablePost, SharedRenderablePost } from "../models";
import { Promise as BluebirdPromise } from "bluebird";
import { PublishedItemType, UnassembledBasePublishedItem } from "../../models";
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
import { assemblePublishedItemById } from "../../utilities/assemblePublishedItems";

export async function assembleRenderablePostsFromCachedComponents({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UnassembledBasePublishedItem[];
  requestorUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePost[]>> {
  const assembleRenderablePostFromCachedComponentsResponses = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await assembleRenderablePostFromCachedComponents({
        controller,
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        requestorUserId,
      }),
  );

  return unwrapListOfEitherResponses({
    eitherResponses: assembleRenderablePostFromCachedComponentsResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assembleRenderablePostFromCachedComponents({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UnassembledBasePublishedItem;
  requestorUserId?: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePost>> {
  //////////////////////////////////////////////////
  // Assemble Base Renderable Published Item
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

  //////////////////////////////////////////////////
  // Open Published Item
  //////////////////////////////////////////////////

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

    const constructPublishedItemFromPartsByIdResponse = await assemblePublishedItemById({
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

    //////////////////////////////////////////////////
    // Assemble Shared Renderable Post
    //////////////////////////////////////////////////

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
