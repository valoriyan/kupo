import { GenericResponseFailedReason } from "../../../controllers/models";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import {
  RenderablePublishedItemComment,
  UnrenderablePublishedItemComment,
} from "./models";
import {
  assembleRenderableUserById,
  assembleRenderableUsersByIds,
} from "../../user/utilities/assembleRenderableUserById";

export async function assembleRenderablePublishedItemCommentById({
  controller,
  blobStorageService,
  databaseService,
  publishedItemCommentId,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  publishedItemCommentId: string;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItemComment>
> {
  //////////////////////////////////////////////////
  // Get Unrenderable Published Item Comment
  //////////////////////////////////////////////////

  const getMaybePublishedItemCommentByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemCommentsTableService.getMaybePublishedItemCommentById(
      {
        controller,
        publishedItemCommentId: publishedItemCommentId,
      },
    );
  if (getMaybePublishedItemCommentByIdResponse.type === EitherType.failure) {
    return getMaybePublishedItemCommentByIdResponse;
  }
  const { success: maybePublishedItemComment } = getMaybePublishedItemCommentByIdResponse;

  if (!maybePublishedItemComment) {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error:
        "Published Item Comment not found at constructRenderablePublishedItemCommentFromPartsById",
      additionalErrorInformation:
        "Published Item Comment not found at constructRenderablePublishedItemCommentFromPartsById",
    });
  }

  const unrenderablePublishedItemComment = maybePublishedItemComment;

  //////////////////////////////////////////////////
  // Assemble Published Item Comment & Return
  //////////////////////////////////////////////////

  return await assembleRenderablePublishedItemCommentFromCachedComponents({
    controller,
    blobStorageService,
    databaseService,
    unrenderablePublishedItemComment,
    clientUserId,
  });
}

export async function assembleRenderablePublishedItemCommentFromCachedComponents({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePublishedItemComment,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  unrenderablePublishedItemComment: UnrenderablePublishedItemComment;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItemComment>
> {
  //////////////////////////////////////////////////
  // Construct Renderable User Who Authored Comment
  //////////////////////////////////////////////////
  const constructRenderableUserFromPartsResponse = await assembleRenderableUserById({
    controller,
    requestorUserId: clientUserId,
    userId: unrenderablePublishedItemComment.authorUserId,
    blobStorageService,
    databaseService,
  });
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: renderableUser } = constructRenderableUserFromPartsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    ...unrenderablePublishedItemComment,
    user: renderableUser,
  });
}

export async function assembleRenderablePublishedItemCommentsFromCachedComponents({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePublishedItemComments,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  unrenderablePublishedItemComments: UnrenderablePublishedItemComment[];
  clientUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItemComment[]>
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const userIds = unrenderablePublishedItemComments.map(
    (publishedItemComment) => publishedItemComment.authorUserId,
  );

  //////////////////////////////////////////////////
  // Assemble Renderable Users Who Wrote Comments
  //////////////////////////////////////////////////

  const constructRenderableUsersFromPartsByUserIdsResponse =
    await assembleRenderableUsersByIds({
      controller,
      requestorUserId: clientUserId,
      userIds,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUsersFromPartsByUserIdsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsByUserIdsResponse;
  }
  const { success: renderableUsers } = constructRenderableUsersFromPartsByUserIdsResponse;

  const userIdToRenderableUserMap = new Map(
    renderableUsers.map((renderableUser) => [renderableUser.userId, renderableUser]),
  );

  //////////////////////////////////////////////////
  // Assemble Renderable Comments
  //////////////////////////////////////////////////

  const renderablePublishedItemComments = unrenderablePublishedItemComments.map(
    (publishedItemComment): RenderablePublishedItemComment => ({
      ...publishedItemComment,
      user: userIdToRenderableUserMap.get(publishedItemComment.authorUserId)!,
    }),
  );

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(renderablePublishedItemComments);
}
