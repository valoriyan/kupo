import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
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

export interface SearchForHashtagsFailed {
  reason: SearchForHashtagsFailedReason;
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
}): Promise<SecuredHTTPResponse<SearchForHashtagsFailed, SearchForHashtagsSuccess>> {
  const { error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  const matchingHashtagsCount =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsCountBySubstring(
      { hashtagSubstring: lowercaseTrimmedQuery },
    );

  if (!matchingHashtagsCount) {
    return {
      success: {
        hashtags: [],
        totalCount: 0,
      },
    };
  }

  const matchingHashtags =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsMatchingSubstring(
      {
        hashtagSubstring: lowercaseTrimmedQuery,
        pageNumber,
        pageSize,
      },
    );

  return {
    success: {
      hashtags: matchingHashtags,
      totalCount: matchingHashtagsCount,
    },
  };
}
