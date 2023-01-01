import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { GenericResponseFailedReason } from "../models";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { assembleRenderableUsersFromCachedComponents } from "./utilities/assembleRenderableUserFromCachedComponents";

export interface SearchUserProfilesByUsernameRequestBody {
  searchString: string;
}

export interface SearchUserProfilesByUsernameSuccess {
  results: RenderableUser[];
}

export enum SearchUserProfilesByUsernameFailedReason {
  NotFound = "User Not Found",
}

export async function handleSearchUserProfilesByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: SearchUserProfilesByUsernameRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | SearchUserProfilesByUsernameFailedReason>,
    SearchUserProfilesByUsernameSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { searchString } = requestBody;

  //////////////////////////////////////////////////
  // Read UnrenderableUsers from DB
  //////////////////////////////////////////////////

  const selectUsersByUsernameMatchingSubstringResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernameMatchingSubstring(
      {
        controller,
        usernameSubstring: searchString.toLowerCase(),
      },
    );
  if (selectUsersByUsernameMatchingSubstringResponse.type === EitherType.failure) {
    return selectUsersByUsernameMatchingSubstringResponse;
  }

  const { success: unrenderableUsers } = selectUsersByUsernameMatchingSubstringResponse;

  if (unrenderableUsers.length === 0) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: SearchUserProfilesByUsernameFailedReason.NotFound,
      additionalErrorInformation: "Error at handleSearchUserProfilesByUsername",
    });
  }

  //////////////////////////////////////////////////
  // Assemble RenderableUsers
  //////////////////////////////////////////////////

  const assembleRenderableUsersFromCachedComponentsResponse =
    await assembleRenderableUsersFromCachedComponents({
      controller,
      requestorUserId: clientUserId,
      unrenderableUsers,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });

  if (assembleRenderableUsersFromCachedComponentsResponse.type === EitherType.failure) {
    return assembleRenderableUsersFromCachedComponentsResponse;
  }
  const { success: renderableUsers } =
    assembleRenderableUsersFromCachedComponentsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({ results: renderableUsers });
}
