import { BlobStorageService } from "../../../../services/blobStorageService";
import { DatabaseService } from "../../../../services/databaseService";
import { RootRenderablePost } from "../models";
import { BaseRenderablePublishedItem, PublishedItemType } from "../../models";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { assemblePostMediaElements } from "./assemblePostMediaElements";

export async function assembleRootRenderablePost({
  controller,
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
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
