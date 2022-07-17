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
} from "../../user/utilities";
import { RenderablePostComment, UnrenderablePostComment } from "./models";

export async function constructRenderablePostCommentFromPartsById({
  controller,
  blobStorageService,
  databaseService,
  postCommentId,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  postCommentId: string;
  clientUserId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePostComment>> {
  const getPostCommentByIdResponse =
    await databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentById(
      {
        controller,
        postCommentId,
      },
    );
  if (getPostCommentByIdResponse.type === EitherType.failure) {
    return getPostCommentByIdResponse;
  }
  const { success: unrenderablePostComment } = getPostCommentByIdResponse;

  return await constructRenderablePostCommentFromParts({
    controller,
    blobStorageService,
    databaseService,
    unrenderablePostComment,
    clientUserId,
  });
}

export async function constructRenderablePostCommentFromParts({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePostComment,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePostComment: UnrenderablePostComment;
  clientUserId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePostComment>> {
  const selectUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      controller,
      userId: unrenderablePostComment.authorUserId,
    });

  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUser } = selectUserByUserIdResponse;

  if (!unrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at constructRenderablePostCommentFromParts",
      additionalErrorInformation:
        "User not found at constructRenderablePostCommentFromParts",
    });
  }

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      clientUserId,
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
    ...unrenderablePostComment,
    user: renderableUser,
  });
}

export async function constructRenderablePostCommentsFromParts({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePostComments,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePostComments: UnrenderablePostComment[];
  clientUserId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePostComment[]>> {
  const userIds = unrenderablePostComments.map((postComment) => postComment.authorUserId);

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
      clientUserId,
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

  const renderablePostComments = unrenderablePostComments.map(
    (postComment): RenderablePostComment => ({
      ...postComment,
      user: userIdToRenderableUserMap.get(postComment.authorUserId)!,
    }),
  );

  return Success(renderablePostComments);
}
