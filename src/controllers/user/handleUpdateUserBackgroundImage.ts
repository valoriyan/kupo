import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities";

export enum UpdateUserBackgroundImageFailedReason {
  Unknown = "Unknown",
}

export interface UpdateUserBackgroundImageFailed {
  reason: UpdateUserBackgroundImageFailedReason;
}

export type UpdateUserBackgroundImageSuccess = RenderableUser;

export interface UpdateUserBackgroundImageRequestBody {
  backgroundImage: Express.Multer.File;
}

export async function handleUpdateUserBackgroundImage({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: UpdateUserBackgroundImageRequestBody;
}): Promise<
  SecuredHTTPResponse<UpdateUserBackgroundImageFailed, UpdateUserBackgroundImageSuccess>
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const backgroundImageBlobItemPointer = requestBody.backgroundImage
    ? await controller.blobStorageService.saveImage({
        image: requestBody.backgroundImage?.buffer,
      })
    : null;

  const updatedUnrenderableUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserByUserId(
      {
        userId: clientUserId,

        backgroundImageBlobFileKey: backgroundImageBlobItemPointer?.fileKey,
      },
    );

  if (!updatedUnrenderableUser) {
    controller.setStatus(404);
    return { error: { reason: UpdateUserBackgroundImageFailedReason.Unknown } };
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
