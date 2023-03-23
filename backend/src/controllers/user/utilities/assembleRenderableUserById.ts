import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { RenderableUser } from "../models";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
} from "../../../utilities/monads";
import { GenericResponseFailedReason } from "../../models";
import {
  assembleRenderableUsersFromCachedComponents,
  assembleRenderableUserFromCachedComponents,
} from "./assembleRenderableUserFromCachedComponents";

export async function assembleRenderableUsersByIds({
  controller,
  requestorUserId,
  userIds,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string | undefined;
  userIds: string[];
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser[]>> {
  //////////////////////////////////////////////////
  // Read UnrenderableUsers from DB
  //////////////////////////////////////////////////

  const unrenderableUsersResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds({
      controller,
      userIds,
    });

  if (unrenderableUsersResponse.type === EitherType.failure) {
    return unrenderableUsersResponse;
  }
  const { success: unrenderableUsers } = unrenderableUsersResponse;

  //////////////////////////////////////////////////
  // Continue Request
  //////////////////////////////////////////////////

  return await assembleRenderableUsersFromCachedComponents({
    controller,
    requestorUserId: requestorUserId,
    unrenderableUsers,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });
}

export async function assembleRenderableUserById({
  controller,
  requestorUserId,
  userId,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string | undefined;
  userId: string;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser>> {
  //////////////////////////////////////////////////
  // Read UnrenderableUsers from DB
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId,
      },
    );

  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }

  const { success: maybeUnrenderableUser } = selectMaybeUserByUserIdResponse;

  if (!maybeUnrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at assembleRenderableUserById",
      additionalErrorInformation: "Error at assembleRenderableUserById",
    });
  }

  const unrenderableUser = maybeUnrenderableUser;

  //////////////////////////////////////////////////
  // Continue Request
  //////////////////////////////////////////////////

  return await assembleRenderableUserFromCachedComponents({
    controller,
    requestorUserId: requestorUserId,
    unrenderableUser,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });
}
