import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { GenericResponseFailedReason } from "../models";
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
    ErrorReasonTypes<string | UpdateUserBackgroundImageFailedReason>,
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

  const updateUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserByUserId(
      {
        controller,
        userId: clientUserId,

        backgroundImageBlobFileKey: backgroundImageBlobItemPointer?.fileKey,
      },
    );
  if (updateUserByUserIdResponse.type === EitherType.failure) {
    return updateUserByUserIdResponse;
  }

  const { success: updatedUnrenderableUser } = updateUserByUserIdResponse;

  if (!updatedUnrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleUpdateUserBackgroundImage",
      additionalErrorInformation: "Error at handleUpdateUserBackgroundImage",
    });
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

  return constructRenderableUserFromPartsResponse;
}
