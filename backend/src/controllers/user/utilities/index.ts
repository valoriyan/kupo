import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
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
  constructRenderableUsersFromParts,
  constructRenderableUserFromParts,
} from "./constructRenderableUserFromParts";

export async function constructRenderableUsersFromPartsByUserIds({
  controller,
  requestorUserId,
  userIds,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string;
  userIds: string[];
  blobStorageService: BlobStorageServiceInterface;
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

  return await constructRenderableUsersFromParts({
    controller,
    requestorUserId: requestorUserId,
    unrenderableUsers,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });
}

export async function constructRenderableUserFromPartsByUserId({
  controller,
  requestorUserId,
  userId,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string;
  userId: string;
  blobStorageService: BlobStorageServiceInterface;
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
    return await constructRenderableUserFromParts({
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
