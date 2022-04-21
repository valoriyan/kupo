import express from "express";
import { Color } from "../../types/color";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ProfilePrivacySetting, RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities";

export enum UpdateUserProfileFailedReason {
  Unknown = "Unknown",
}

export interface UpdateUserProfileFailed {
  reason: UpdateUserProfileFailedReason;
}

export type UpdateUserProfileSuccess = RenderableUser;

export interface UpdateUserProfileRequestBody {
  username?: string;
  shortBio?: string;
  userWebsite?: string;
  userEmail?: string;
  phoneNumber?: string;
  preferredPagePrimaryColor?: Color;
  profileVisibility?: ProfilePrivacySetting;
}

export async function handleUpdateUserProfile({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: UpdateUserProfileRequestBody & {
    backgroundImage?: Express.Multer.File;
    profilePicture?: Express.Multer.File;
  };
}): Promise<SecuredHTTPResponse<UpdateUserProfileFailed, UpdateUserProfileSuccess>> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const backgroundImageBlobItemPointer = requestBody.backgroundImage
    ? await controller.blobStorageService.saveImage({
        image: requestBody.backgroundImage?.buffer,
      })
    : null;
  const profilePictureBlobItemPointer = requestBody.profilePicture
    ? await controller.blobStorageService.saveImage({
        image: requestBody.profilePicture?.buffer,
      })
    : null;

  const updatedUnrenderableUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserByUserId(
      {
        userId: clientUserId,

        username: requestBody.username,
        shortBio: requestBody.shortBio,
        userWebsite: requestBody.userWebsite,
        profilePrivacySetting: requestBody.profileVisibility,
        email: requestBody.userEmail,
        backgroundImageBlobFileKey: backgroundImageBlobItemPointer?.fileKey,
        profilePictureBlobFileKey: profilePictureBlobItemPointer?.fileKey,
        preferredPagePrimaryColor: requestBody.preferredPagePrimaryColor,
      },
    );

  if (!updatedUnrenderableUser) {
    controller.setStatus(404);
    return { error: { reason: UpdateUserProfileFailedReason.Unknown } };
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
