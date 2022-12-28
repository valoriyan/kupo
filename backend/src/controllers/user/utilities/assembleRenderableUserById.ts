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
  requestorUserId: string;
  userIds: string[];
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser[]>> {
  const unrenderableUsersResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds({
      controller,
      userIds,
    });

  if (unrenderableUsersResponse.type === EitherType.failure) {
    return unrenderableUsersResponse;
  }
  const { success: unrenderableUsers } = unrenderableUsersResponse;

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
  requestorUserId: string;
  userId: string;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser>> {
  const unrenderableUserResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId,
      },
    );

  if (unrenderableUserResponse.type === EitherType.failure) {
    return unrenderableUserResponse;
  }

  const { success: unrenderableUser } = unrenderableUserResponse;

  if (!!unrenderableUser) {
    return await assembleRenderableUserFromCachedComponents({
      controller,
      requestorUserId: requestorUserId,
      unrenderableUser,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  } else {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at constructRenderableUserFromPartsByUserId",
      additionalErrorInformation: "Error at constructRenderableUserFromPartsByUserId",
    });
  }
}
