import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import { RenderableUser } from "../models";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
} from "../../../utilities/monads";
import { assembleRenderableUsersFromCachedComponents } from "./assembleRenderableUserFromCachedComponents";

export async function assembleRenderableUsersByUsernames({
  controller,
  requestorUserId,
  usernames,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  requestorUserId: string;
  usernames: string[];
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser[]>> {
  //////////////////////////////////////////////////
  // Read Unrenderable Users from DB
  //////////////////////////////////////////////////

  const selectUsersByUsernamesResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      {
        controller,
        usernames,
      },
    );

  if (selectUsersByUsernamesResponse.type === EitherType.failure) {
    return selectUsersByUsernamesResponse;
  }
  const { success: unrenderableUsers } = selectUsersByUsernamesResponse;

  //////////////////////////////////////////////////
  // Continue Request
  //////////////////////////////////////////////////

  return await assembleRenderableUsersFromCachedComponents({
    controller,
    requestorUserId: requestorUserId,
    unrenderableUsers,
    blobStorageService: blobStorageService,
    databaseService: databaseService,
  });
}
