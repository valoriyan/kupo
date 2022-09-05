import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../auth/utilities";

export interface SearchForHashtagsRequestBody {
  query: string;
  pageNumber: number;
  pageSize: number;
}

export enum SearchForHashtagsFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface SearchForHashtagsSuccess {
  hashtags: string[];
  totalCount: number;
}

export async function handleSearchForHashtags({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: SearchForHashtagsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | SearchForHashtagsFailedReason>,
    SearchForHashtagsSuccess
  >
> {
  const { errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  const getHashtagsCountBySubstringResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemHashtagsTableService.getHashtagsCountBySubstring(
      { controller, hashtagSubstring: lowercaseTrimmedQuery },
    );
  if (getHashtagsCountBySubstringResponse.type === EitherType.failure) {
    return getHashtagsCountBySubstringResponse;
  }
  const { success: matchingHashtagsCount } = getHashtagsCountBySubstringResponse;

  if (!matchingHashtagsCount) {
    return Success({
      hashtags: [],
      totalCount: 0,
    });
  }

  const getHashtagsMatchingSubstringResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemHashtagsTableService.getHashtagsMatchingSubstring(
      {
        controller,
        hashtagSubstring: lowercaseTrimmedQuery,
        pageNumber,
        pageSize,
      },
    );
  if (getHashtagsMatchingSubstringResponse.type === EitherType.failure) {
    return getHashtagsMatchingSubstringResponse;
  }
  const { success: matchingHashtags } = getHashtagsMatchingSubstringResponse;

  return Success({
    hashtags: matchingHashtags,
    totalCount: matchingHashtagsCount,
  });
}
