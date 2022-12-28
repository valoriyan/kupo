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
import { assemblePostMediaElementsByIds } from "./assemblePostMediaElements";

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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Assemble Media Items
  //////////////////////////////////////////////////

  const assemblePostMediaElementsByIdsResponse = await assemblePostMediaElementsByIds({
    controller,
    publishedItemId: id,
    blobStorageService,
    databaseService,
  });
  if (assemblePostMediaElementsByIdsResponse.type === EitherType.failure) {
    return assemblePostMediaElementsByIdsResponse;
  }
  const { success: mediaElements } = assemblePostMediaElementsByIdsResponse;

  //////////////////////////////////////////////////
  // Assemble Root Renderable Post
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(rootRenderablePost);
}
