import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { FileDescriptor, GenericResponseFailedReason } from "../models";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { assembleRenderableUserFromCachedComponents } from "./utilities/assembleRenderableUserFromCachedComponents";

export enum UpdateUserBackgroundImageFailedReason {
  Unknown = "Unknown",
}

export type UpdateUserBackgroundImageSuccess = RenderableUser;

export interface UpdateUserBackgroundImageRequestBody {
  backgroundImage: FileDescriptor;
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { backgroundImage } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Write Update to DB
  //////////////////////////////////////////////////

  const updateUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserByUserId(
      {
        controller,
        userId: clientUserId,

        backgroundImageBlobFileKey: backgroundImage.blobFileKey,
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

  //////////////////////////////////////////////////
  // Get Renderable User
  //////////////////////////////////////////////////

  const constructRenderableUserFromPartsResponse =
    await assembleRenderableUserFromCachedComponents({
      controller,
      requestorUserId: clientUserId,
      unrenderableUser: updatedUnrenderableUser,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return constructRenderableUserFromPartsResponse;
}
