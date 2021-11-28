import express from "express";
import { Color } from "src/types/color";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ProfilePrivacySetting, RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities";

export enum FailedToUpdateUserProfileResponseReason {
  Unknown = "Unknown",
}

export interface FailedToUpdateUserProfileResponse {
  reason: FailedToUpdateUserProfileResponseReason;
}

export type SuccessfulUpdateToUserProfileResponse = RenderableUser;

export interface UpdateUserProfileRequestBody {
  username?: string;
  shortBio?: string;
  userWebsite?: string;
  userEmail?: string;
  phoneNumber?: string;
  preferredPagePrimaryColor?: Color;
  profileVisibility?: ProfilePrivacySetting;
  backgroundImage?: Express.Multer.File;
  profilePicture?: Express.Multer.File;
}

export async function handleUpdateUserProfile({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: UpdateUserProfileRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedToUpdateUserProfileResponse,
    SuccessfulUpdateToUserProfileResponse
  >
> {
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
    return { error: { reason: FailedToUpdateUserProfileResponseReason.Unknown } };
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
