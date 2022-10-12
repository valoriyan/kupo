/* eslint-disable @typescript-eslint/ban-types */
import { DatabaseService } from "../../../../services/databaseService";
import { UncompiledBasePublishedItem } from "../../models";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { AuthFailedReason } from "../../../auth/models";
import { canUserViewUserContentByUserId } from "../../../../controllers/auth/utilities/canUserViewUserContent";

export async function assertViewingRightsOnPublishedItem({
  controller,
  databaseService,
  uncompiledBasePublishedItem,
  requestorUserId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  requestorUserId?: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const { authorUserId } = uncompiledBasePublishedItem;

  //////////////////////////////////////////////////
  // User has viewing rights to their own items
  //////////////////////////////////////////////////
  if (authorUserId === requestorUserId) {
    return Success({});
  }

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

  if (!!requestorHasViewingRights) {
    return Success({});
  }

  return Failure({
    controller,
    httpStatusCode: 404,
    reason: AuthFailedReason.IllegalAccess,
    error: "User not permitted to view item",
    additionalErrorInformation: "User not permitted to view item",
  });
}
