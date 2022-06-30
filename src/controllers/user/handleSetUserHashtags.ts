import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserPageController } from "./userPageController";

export interface SetUserHashtagsRequestBody {
  hashtags: string[];
}

export enum SetUserHashtagsFailedReason {
  NotFound = "User Not Found",
}

export interface SetUserHashtagsFailed {
  reason: SetUserHashtagsFailedReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SetUserHashtagsSuccess {}

export async function handleSetUserHashtags({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: SetUserHashtagsRequestBody;
}): Promise<SecuredHTTPResponse<SetUserHashtagsFailed, SetUserHashtagsSuccess>> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const [hashtag1, hashtag2, hashtag3, hashtag4, hashtag5] = requestBody.hashtags;

  await controller.databaseService.tableNameToServicesMap.userHashtagsTableService.upsertHashtagsForUser(
    {
      userId: clientUserId,
      hashtag1: hashtag1?.toLowerCase() ?? "",
      hashtag2: hashtag2?.toLowerCase() ?? "",
      hashtag3: hashtag3?.toLowerCase() ?? "",
      hashtag4: hashtag4?.toLowerCase() ?? "",
      hashtag5: hashtag5?.toLowerCase() ?? "",
    },
  );

  return {};
}
