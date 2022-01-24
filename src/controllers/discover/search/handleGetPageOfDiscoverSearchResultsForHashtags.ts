import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../auth/utilities";

export interface GetPageOfDiscoverSearchResultsForHashtagsParams {
  query: string;
  cursor?: string;
  pageSize: number;
}

export enum FailedToGetPageOfDiscoverSearchResultsForHashtagsResponseReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToGetPageOfDiscoverSearchResultsForHashtagsResponse {
  reason: FailedToGetPageOfDiscoverSearchResultsForHashtagsResponseReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyGotPageOfDiscoverSearchResultsForHashtagsResponse {
  hashtags: string[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPageOfDiscoverSearchResultsForHashtags({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: GetPageOfDiscoverSearchResultsForHashtagsParams;
}): Promise<
  SecuredHTTPResponse<
    FailedToGetPageOfDiscoverSearchResultsForHashtagsResponse,
    SuccessfullyGotPageOfDiscoverSearchResultsForHashtagsResponse
  >
> {
  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, query, pageSize } = requestBody;
  const trimmedQuery = query.trim();

  const matchingHashtags =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsMatchingSubstring(
      {
        hashtagSubstring: trimmedQuery,
      },
    );

  if (matchingHashtags.length === 0) {
    // controller.setStatus(404);
    return {
      success: {
        hashtags: [],
        previousPageCursor: cursor,
      },
    };
  }

  const pageNumber = parseInt(cursor || "0") || 0;
  const startIndexForPage = pageSize * pageNumber;
  const endIndexForPage = startIndexForPage + pageSize;

  const pageOfMatchingHashtags = matchingHashtags.slice(
    startIndexForPage,
    endIndexForPage,
  );

  return {
    success: {
      hashtags: pageOfMatchingHashtags,
      previousPageCursor: cursor,
      nextPageCursor: (pageNumber + 1).toString(),
    },
  };
}
