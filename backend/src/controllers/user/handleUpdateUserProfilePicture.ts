import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { UploadableKupoFile } from "../models";
import { ingestUploadedFile } from "../utilities/mediaFiles/ingestUploadedFile";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities/constructRenderableUserFromParts";

export enum UpdateUserProfilePictureFailedReason {
  Unknown = "Unknown",
}

export type UpdateUserProfilePictureSuccess = RenderableUser;

export interface UpdateUserProfilePictureRequestBody {
  profilePicture: UploadableKupoFile;
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
  // SAVE IMAGE BLOB
  //////////////////////////////////////////////////

  let profilePictureBlobItemPointer = undefined;
  if (!!profilePicture) {
    const profilePictureKupoFile = ingestUploadedFile({
      uploadableKupoFile: profilePicture,
    });

    const saveImageResponse = await controller.blobStorageService.saveImage({
      controller,
      image: profilePictureKupoFile.buffer,
    });
    if (saveImageResponse.type === EitherType.failure) {
      return saveImageResponse;
    }
    profilePictureBlobItemPointer = saveImageResponse.success;
  }

  //////////////////////////////////////////////////
  // UPDATE DATABASE ENTRY
  //////////////////////////////////////////////////
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
