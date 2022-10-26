import { GenericResponseFailedReason } from "../../../controllers/models";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import {
  constructRenderableUserFromParts,
  constructRenderableUsersFromParts,
} from "../../user/utilities/constructRenderableUserFromParts";
import {
  RenderablePublishedItemComment,
  UnrenderablePublishedItemComment,
} from "./models";

export async function constructRenderablePublishedItemCommentFromPartsById({
  controller,
  blobStorageService,
  databaseService,
  publishedItemCommentId,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  publishedItemCommentId: string;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItemComment>
> {
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

  return await constructRenderablePublishedItemCommentFromParts({
    controller,
    blobStorageService,
    databaseService,
    unrenderablePublishedItemComment,
    clientUserId,
  });
}

export async function constructRenderablePublishedItemCommentFromParts({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePublishedItemComment,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePublishedItemComment: UnrenderablePublishedItemComment;
  clientUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItemComment>
> {
  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId: unrenderablePublishedItemComment.authorUserId,
      },
    );

  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUser } = selectUserByUserIdResponse;

  if (!unrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at constructRenderablePublishedItemCommentFromParts",
      additionalErrorInformation:
        "User not found at constructRenderablePublishedItemCommentFromParts",
    });
  }

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      requestorUserId: clientUserId,
      unrenderableUser,
      blobStorageService,
      databaseService,
    },
  );
  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }
  const { success: renderableUser } = constructRenderableUserFromPartsResponse;

  return Success({
    ...unrenderablePublishedItemComment,
    user: renderableUser,
  });
}

export async function constructRenderablePublishedItemCommentsFromParts({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePublishedItemComments,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePublishedItemComments: UnrenderablePublishedItemComment[];
  clientUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItemComment[]>
> {
  const userIds = unrenderablePublishedItemComments.map(
    (publishedItemComment) => publishedItemComment.authorUserId,
  );

  const selectUsersByUserIdsResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds({
      controller,
      userIds,
    });
  if (selectUsersByUserIdsResponse.type === EitherType.failure) {
    return selectUsersByUserIdsResponse;
  }
  const { success: unrenderableUsers } = selectUsersByUserIdsResponse;

  const constructRenderableUsersFromPartsResponse =
    await constructRenderableUsersFromParts({
      controller,
      requestorUserId: clientUserId,
      unrenderableUsers,
      blobStorageService,
      databaseService,
    });
  if (constructRenderableUsersFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsResponse;
  }
  const { success: renderableUsers } = constructRenderableUsersFromPartsResponse;

  const userIdToRenderableUserMap = new Map(
    renderableUsers.map((renderableUser) => [renderableUser.userId, renderableUser]),
  );

  const renderablePublishedItemComments = unrenderablePublishedItemComments.map(
    (publishedItemComment): RenderablePublishedItemComment => ({
      ...publishedItemComment,
      user: userIdToRenderableUserMap.get(publishedItemComment.authorUserId)!,
    }),
  );

  return Success(renderablePublishedItemComments);
}
