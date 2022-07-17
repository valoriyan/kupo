import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { GenericResponseFailedReason } from "../models";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUsersFromParts } from "./utilities";

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
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { searchString } = requestBody;

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

  const constructRenderableUsersFromPartsResponse =
    await constructRenderableUsersFromParts({
      controller,
      clientUserId,
      unrenderableUsers,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });

  if (constructRenderableUsersFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsResponse;
  }
  const { success: renderableUsers } = constructRenderableUsersFromPartsResponse;

  return Success({ results: renderableUsers });
}
