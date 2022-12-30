/* eslint-disable @typescript-eslint/ban-types */
import { DatabaseService } from "../../../../services/databaseService";
import { UnassembledBasePublishedItem } from "../../models";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { AuthFailedReason } from "../../../auth/models";
import { canUserViewUserContentByUserId } from "../../../../controllers/auth/utilities/canUserViewUserContentByUserId";

export async function assertViewingRightsOnPublishedItem({
  controller,
  databaseService,
  uncompiledBasePublishedItem,
  requestorUserId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UnassembledBasePublishedItem;
  requestorUserId?: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const { authorUserId } = uncompiledBasePublishedItem;

  //////////////////////////////////////////////////
  // User Has Viewing Rights to Their Own Items
  //////////////////////////////////////////////////
  if (authorUserId === requestorUserId) {
    return Success({});
  }

  //////////////////////////////////////////////////
  // Continue Authorization Process
  //////////////////////////////////////////////////

  const canUserViewUserContentByUserIdResponse = await canUserViewUserContentByUserId({
    controller,
    requestorUserId,
    targetUserId: authorUserId,
    databaseService,
  });

  if (canUserViewUserContentByUserIdResponse.type === EitherType.failure) {
    return canUserViewUserContentByUserIdResponse;
  }
  const { success: requestorHasViewingRights } = canUserViewUserContentByUserIdResponse;

  //////////////////////////////////////////////////
  // Return on Authorization Success
  //////////////////////////////////////////////////

  if (!!requestorHasViewingRights) {
    return Success({});
  }

  //////////////////////////////////////////////////
  // Throw if Authorization Failed
  //////////////////////////////////////////////////

  return Failure({
    controller,
    httpStatusCode: 404,
    reason: AuthFailedReason.IllegalAccess,
    error: "User not permitted to view item",
    additionalErrorInformation: "User not permitted to view item",
  });
}
