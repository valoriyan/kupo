import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities";

export enum UpdateUserProfilePictureFailedReason {
  Unknown = "Unknown",
}

export interface UpdateUserProfilePictureFailed {
  reason: UpdateUserProfilePictureFailedReason;
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
  SecuredHTTPResponse<UpdateUserProfilePictureFailed, UpdateUserProfilePictureSuccess>
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const profilePictureBlobItemPointer = requestBody.profilePicture
    ? await controller.blobStorageService.saveImage({
        image: requestBody.profilePicture?.buffer,
      })
    : null;

  const updatedUnrenderableUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserByUserId(
      {
        userId: clientUserId,

        profilePictureBlobFileKey: profilePictureBlobItemPointer?.fileKey,
      },
    );

  if (!updatedUnrenderableUser) {
    controller.setStatus(404);
    return { error: { reason: UpdateUserProfilePictureFailedReason.Unknown } };
  }

  const renderableUser = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser: updatedUnrenderableUser,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  return {
    success: renderableUser,
  };
}
