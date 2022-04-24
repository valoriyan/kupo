import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../auth/utilities";

export interface SearchForHashtagsRequestBody {
  query: string;
  cursor?: string;
  pageSize: number;
}

export enum SearchForHashtagsFailedReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchForHashtagsFailed {
  reason: SearchForHashtagsFailedReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchForHashtagsSuccess {
  hashtags: string[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleSearchForHashtags({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: SearchForHashtagsRequestBody;
}): Promise<SecuredHTTPResponse<SearchForHashtagsFailed, SearchForHashtagsSuccess>> {
  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  const matchingHashtags =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsMatchingSubstring(
      {
        hashtagSubstring: lowercaseTrimmedQuery,
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
