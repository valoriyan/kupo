import { BlobStorageService } from "src/services/blobStorageService/models";
import { DatabaseService } from "src/services/databaseService";
import { UnrenderableUser } from "../user/models";
import {
  constructRenderableUserFromParts,
  constructRenderableUsersFromParts,
} from "../user/utilities";
import { RenderablePostComment, UnrenderablePostComment } from "./models";

export async function constructRenderablePostCommentFromParts({
  blobStorageService,
  databaseService,
  unrenderablePostComment,
  clientUserId,
}: {
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  unrenderablePostComment: UnrenderablePostComment;
  clientUserId: string;
}): Promise<RenderablePostComment> {
  const unrenderableUser =
    await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
      userId: unrenderablePostComment.authorUserId,
    });

  if (!unrenderableUser) {
    throw new Error(`Missing user: ${unrenderablePostComment.authorUserId}`);
  }

  const renderableUser = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser,
    blobStorageService,
    databaseService,
  });

  return {
    ...unrenderablePostComment,
    user: renderableUser,
  };
}

export async function constructRenderablePostCommentsFromParts({
  blobStorageService,
  databaseService,
  unrenderablePostComments,
  clientUserId,
}: {
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  unrenderablePostComments: UnrenderablePostComment[];
  clientUserId: string;
}): Promise<RenderablePostComment[]> {
  const userIds = unrenderablePostComments.map((postComment) => postComment.authorUserId);

  const unrenderableUsers: UnrenderableUser[] =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds({
      userIds,
    });

  const renderableUsers = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers,
    blobStorageService,
    databaseService,
  });

  const userIdToRenderableUserMap = new Map(
    renderableUsers.map((renderableUser) => [renderableUser.userId, renderableUser]),
  );

  const renderablePostComments = unrenderablePostComments.map(
    (postComment): RenderablePostComment => ({
      ...postComment,
      user: userIdToRenderableUserMap.get(postComment.authorUserId)!,
    }),
  );

  return renderablePostComments;
}
