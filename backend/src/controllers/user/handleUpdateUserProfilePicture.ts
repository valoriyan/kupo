import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities/constructRenderableUserFromParts";
import { FileDescriptor } from "../models";

export enum UpdateUserProfilePictureFailedReason {
  Unknown = "Unknown",
}

export type UpdateUserProfilePictureSuccess = RenderableUser;

export interface UpdateUserProfilePictureRequestBody {
  profilePicture: FileDescriptor;
}

export async function handleUpdateUserProfilePicture({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: UpdateUserProfilePictureRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UpdateUserProfilePictureFailedReason>,
    UpdateUserProfilePictureSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { profilePicture } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // UPDATE DATABASE ENTRY
  //////////////////////////////////////////////////
  const updateUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserByUserId(
      {
        controller,
        userId: clientUserId,

        profilePictureBlobFileKey: profilePicture.blobFileKey,
      },
    );

  if (updateUserByUserIdResponse.type === EitherType.failure) {
    return updateUserByUserIdResponse;
  }

  const { success: updatedUnrenderableUser } = updateUserByUserIdResponse;

  if (!updatedUnrenderableUser) {
    controller.setStatus(404);
    return {
      type: EitherType.failure,
      error: { reason: UpdateUserProfilePictureFailedReason.Unknown },
    };
  }

  //////////////////////////////////////////////////
  // RECOMPILE USER
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      requestorUserId: clientUserId,
      unrenderableUser: updatedUnrenderableUser,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    },
  );

  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }

  //////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////

  return constructRenderableUserFromPartsResponse;
}
