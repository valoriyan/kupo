import express from "express";
import { HTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ProfilePrivacySetting } from "./models";
import { UserPageController } from "./userPageController";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToUpdateUserProfileResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulUpdateToUserProfileResponse {}

export async function handleUpdateUserProfile({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: {
    username?: string;
    shortBio?: string;
    userWebsite?: string;
    profileVisibility?: ProfilePrivacySetting;
    backgroundImage?: Express.Multer.File;
    profilePicture?: Express.Multer.File;
  };
}): Promise<
  HTTPResponse<FailedToUpdateUserProfileResponse, SuccessfulUpdateToUserProfileResponse>
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

  await controller.databaseService.tableServices.usersTableService.updateUserByUserId({
    userId: clientUserId,

    username: requestBody.username,
    shortBio: requestBody.shortBio,
    userWebsite: requestBody.userWebsite,
    profilePrivacySetting: requestBody.profileVisibility,
    backgroundImageBlobFileKey: backgroundImageBlobItemPointer?.fileKey,
    profilePictureBlobFileKey: profilePictureBlobItemPointer?.fileKey,
  });

  return {};
}
