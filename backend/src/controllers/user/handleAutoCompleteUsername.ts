import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { assembleRenderableUsersFromCachedComponents } from "./utilities/assembleRenderableUserFromCachedComponents";

export interface AutoCompleteUsernameRequestBody {
  searchString: string;
  limit: number;
}

export interface AutoCompleteUsernameSuccess {
  results: RenderableUser[];
}

export async function handleAutoCompleteUsername({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: AutoCompleteUsernameRequestBody;
}): Promise<SecuredHTTPResponse<ErrorReasonTypes<string>, AutoCompleteUsernameSuccess>> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { searchString, limit } = requestBody;

  //////////////////////////////////////////////////
  // Read UnrenderableUsers from DB
  //////////////////////////////////////////////////

  const selectUsersByUsernameMatchingSubstringResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernameMatchingSubstring(
      {
        controller,
        usernameSubstring: searchString.toLowerCase(),
        limit,
      },
    );
  if (selectUsersByUsernameMatchingSubstringResponse.type === EitherType.failure) {
    return selectUsersByUsernameMatchingSubstringResponse;
  }

  const { success: unrenderableUsers } = selectUsersByUsernameMatchingSubstringResponse;

  if (unrenderableUsers.length === 0) {
    return Success({ results: [] });
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
