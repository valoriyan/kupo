import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { UserPageController } from "./userPageController";

export interface SetUserHashtagsRequestBody {
  hashtags: string[];
}

export enum FailedToSetUserHashtagsResponseReason {
  NotFound = "User Not Found",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToSetUserHashtagsResponse {
  reason: FailedToSetUserHashtagsResponseReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullySetUserHashtagsResponse {}

export async function handleSetUserHashtags({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: SetUserHashtagsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedToSetUserHashtagsResponse,
    SuccessfullySetUserHashtagsResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const [hashtag1, hashtag2, hashtag3, hashtag4, hashtag5] = requestBody.hashtags;

  await controller.databaseService.tableNameToServicesMap.userHashtagsTableService.upsertHashtagsForUser(
    {
      userId: clientUserId,
      hashtag1,
      hashtag2,
      hashtag3,
      hashtag4,
      hashtag5,
    },
  );

  return {};
}
