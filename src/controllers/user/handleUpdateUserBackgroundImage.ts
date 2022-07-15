import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities";

export enum UpdateUserBackgroundImageFailedReason {
  Unknown = "Unknown",
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
  SecuredHTTPResponse<
    UpdateUserBackgroundImageFailedReason,
    UpdateUserBackgroundImageSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
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
    return { type: EitherType.error, error: { reason: UpdateUserBackgroundImageFailedReason.Unknown } };
  }

  const renderableUser = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser: updatedUnrenderableUser,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  return {
    type: EitherType.success,
    success: renderableUser,
  };
}
