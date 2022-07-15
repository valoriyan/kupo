import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../../types/monads";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../auth/utilities";
import { generateErrorResponse } from "../../../controllers/utilities/generateErrorResponse";
import { GenericResponseFailedReason } from "../../../controllers/models";

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
  SecuredHTTPResponse<SearchForHashtagsFailedReason, SearchForHashtagsSuccess>
> {
  const { errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  try {
    const matchingHashtagsCount =
      await controller.databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsCountBySubstring(
        { hashtagSubstring: lowercaseTrimmedQuery },
      );

    if (!matchingHashtagsCount) {
      return {
        type: EitherType.success,
        success: {
          hashtags: [],
          totalCount: 0,
        },
      };
    }

    try {
      const matchingHashtags =
        await controller.databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsMatchingSubstring(
          {
            hashtagSubstring: lowercaseTrimmedQuery,
            pageNumber,
            pageSize,
          },
        );

      return {
        type: EitherType.success,
        success: {
          hashtags: matchingHashtags,
          totalCount: matchingHashtagsCount,
        },
      };
    } catch (error) {
      return generateErrorResponse({
        controller,
        errorReason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        additionalErrorInformation:
          "Error at hashtagTableService.getHashtagsMatchingSubstring",
        error,
        httpStatusCode: 500,
      });
    }
  } catch (error) {
    return generateErrorResponse({
      controller,
      errorReason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      additionalErrorInformation:
        "Error at hashtagTableService.getHashtagsCountBySubstring",
      error,
      httpStatusCode: 500,
    });
  }
}
