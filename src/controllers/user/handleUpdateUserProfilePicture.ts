import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities";

export enum UpdateUserProfilePictureFailedReason {
  Unknown = "Unknown",
}

export type UpdateUserProfilePictureSuccess = RenderableUser;

export interface UpdateUserProfilePictureRequestBody {
  profilePicture: Express.Multer.File;
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
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const profilePictureBlobItemPointer = requestBody.profilePicture
    ? await controller.blobStorageService.saveImage({
        image: requestBody.profilePicture?.buffer,
      })
    : null;

  const updateUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserByUserId(
      {
        controller,
        userId: clientUserId,

        profilePictureBlobFileKey: profilePictureBlobItemPointer?.fileKey,
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

  const constructRenderableUserFromPartsResponse = await constructRenderableUserFromParts(
    {
      controller,
      clientUserId,
      unrenderableUser: updatedUnrenderableUser,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    },
  );

  if (constructRenderableUserFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsResponse;
  }

  return constructRenderableUserFromPartsResponse;
}
