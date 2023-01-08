/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { Controller } from "tsoa";

import { TableService } from "../models";
import { UsersTableService } from "../users/usersTableService";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "../utilities";
import { PublishingChannelsTableService } from "./publishingChannelsTableService";
import { PublishedItemsTableService } from "../publishedItem/publishedItemsTableService";
import { PublishedItemType } from "../../../../controllers/publishedItem/models";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DBPublishingChannelSubmission {
  publishing_channel_submission_id: string;

  publishing_channel_id: string;
  user_id_submitting_published_item: string;
  published_item_id: string;

  timestamp_of_submission: string;
  timestamp_of_resolution_decision: string;

  reason_for_rejected_submission?: string;

  is_pending: boolean;
}

export class PublishingChannelSubmissionsTableService extends TableService {
  public static readonly tableName = `publishing_channel_submissions`;
  public readonly tableName = PublishingChannelSubmissionsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [
    PublishingChannelsTableService.tableName,
    UsersTableService.tableName,
    PublishedItemsTableService.tableName,
  ];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        publishing_channel_submission_id VARCHAR(64) NOT NULL,
        publishing_channel_id VARCHAR(64) NOT NULL,
        user_id_submitting_published_item VARCHAR(64) NOT NULL,
        published_item_id VARCHAR(64) NOT NULL,
        timestamp_of_submission BIGINT NOT NULL,
        timestamp_of_resolution_decision BIGINT,
        is_pending boolean NOT NULL,

        reason_for_rejected_submission VARCHAR(64),

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (publishing_channel_submission_id),

        CONSTRAINT ${this.tableName}_${PublishingChannelsTableService.tableName}_fkey
          FOREIGN KEY (publishing_channel_id)
          REFERENCES ${PublishingChannelsTableService.tableName} (publishing_channel_id),


        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (user_id_submitting_published_item)
          REFERENCES ${UsersTableService.tableName} (user_id),

        CONSTRAINT ${this.tableName}_${PublishedItemsTableService.tableName}_fkey
          FOREIGN KEY (published_item_id)
          REFERENCES ${PublishedItemsTableService.tableName} (id)
          ON DELETE CASCADE
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async submitPublishedItemToPublishingChannel({
    controller,
    publishingChannelSubmissionId,
    publishingChannelId,
    userIdSubmittingPublishedItem,
    publishedItemId,
    timestampOfSubmission,
    isPending,
  }: {
    controller: Controller;
    publishingChannelSubmissionId: string;
    publishingChannelId: string;
    userIdSubmittingPublishedItem: string;
    publishedItemId: string;
    timestampOfSubmission: number;
    isPending: boolean;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const isPendingValue = !!isPending ? "true" : "false";

      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            {
              field: "publishing_channel_submission_id",
              value: publishingChannelSubmissionId,
            },
            { field: "publishing_channel_id", value: publishingChannelId },
            {
              field: "user_id_submitting_published_item",
              value: userIdSubmittingPublishedItem,
            },
            { field: "published_item_id", value: publishedItemId },
            { field: "timestamp_of_submission", value: timestampOfSubmission },
            { field: "is_pending", value: isPendingValue },
          ],
        ],
        tableName: this.tableName,
      });

      await this.datastorePool.query(query);
      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelSubmissionsTableService.createPublishingChannel",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPublishingChannelSubmissionById({
    controller,
    publishingChannelSubmissionId,
  }: {
    controller: Controller;
    publishingChannelSubmissionId: string;
  }): Promise<
    InternalServiceResponse<
      ErrorReasonTypes<string>,
      DBPublishingChannelSubmission | null
    >
  > {
    try {
      const values: (string | number)[] = [publishingChannelSubmissionId];

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            publishing_channel_submission_id = $1
          ;
        `,
        values,
      };

      const response: QueryResult<DBPublishingChannelSubmission> =
        await this.datastorePool.query(query);

      const rows = response.rows;
      if (rows.length === 0) {
        return Success(null);
      }

      return Success(rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelSubmissionsTableService.getPublishingChannelSubmissionById",
      });
    }
  }

  public async getPublishingChannelSubmissionsByPublishingChannelId({
    controller,
    publishingChannelId,
    limit,
    getSubmissionsBeforeTimestamp,
    arePending,
    publishedItemType,
    hasBeenRejectedWithAReason,
  }: {
    controller: Controller;
    publishingChannelId: string;
    limit?: number;
    getSubmissionsBeforeTimestamp?: number;
    arePending: boolean;
    publishedItemType?: PublishedItemType;
    hasBeenRejectedWithAReason: boolean;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelSubmission[]>
  > {
    try {
      const isPendingValue = !!arePending ? "true" : "false";

      const values: (string | number)[] = [publishingChannelId, isPendingValue];

      let getSubmissionsBeforeTimestampClause = "";
      if (!!getSubmissionsBeforeTimestamp) {
        getSubmissionsBeforeTimestampClause = `
          AND
            timestamp_of_submission < $${values.length + 1}
        `;

        values.push(getSubmissionsBeforeTimestamp);
      }

      let limitClause = "";
      if (!!limit) {
        limitClause = `
          LIMIT $${values.length + 1}
        `;

        values.push(limit);
      }

      let publishedItemTypeClause = "";
      if (!!publishedItemType) {
        publishedItemTypeClause = `
        AND
          ${PublishedItemsTableService.tableName}.type = $${values.length + 1}
        `;

        values.push(publishedItemType);
      }

      let reasonForRejectedSubmissionClause = "";
      if (!!hasBeenRejectedWithAReason) {
        reasonForRejectedSubmissionClause = `
          AND
            reason_for_rejected_submission IS NOT NULL
        `;
      } else {
        reasonForRejectedSubmissionClause = `
          AND
            reason_for_rejected_submission IS NULL
        `;
      }

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          INNER JOIN
            ${PublishedItemsTableService.tableName}
              ON
                ${this.tableName}.published_item_id = ${PublishedItemsTableService.tableName}.id
          WHERE
              publishing_channel_id = $1
            AND
              is_pending = $2
            ${publishedItemTypeClause}
            ${getSubmissionsBeforeTimestampClause}
            ${reasonForRejectedSubmissionClause}
          ORDER BY
            timestamp_of_submission DESC
          ${limitClause}
          ;
        `,
        values,
      };

      const response: QueryResult<DBPublishingChannelSubmission> =
        await this.datastorePool.query(query);

      const rows = response.rows;

      return Success(rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelSubmissionsTableService.selectPublishingChannelByPublishingChannelId",
      });
    }
  }

  public async getPublishingChannelsAssociatedWithPublishedItemId({
    controller,
    publishedItemId,
  }: {
    controller: Controller;
    publishedItemId: string;
  }): Promise<
    InternalServiceResponse<
      ErrorReasonTypes<string>,
      { publishing_channel_id: string; name: string }[]
    >
  > {
    try {
      const values: (string | number)[] = [publishedItemId];

      const query = {
        text: `
          SELECT
            ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_id as publishing_channel_id,
            ${PublishingChannelsTableService.tableName}.name as name
          FROM
            ${PublishingChannelSubmissionsTableService.tableName}
          INNER JOIN
            ${PublishingChannelsTableService.tableName}
            ON
              ${PublishingChannelSubmissionsTableService.tableName}.publishing_channel_id = ${PublishingChannelsTableService.tableName}.publishing_channel_id
          WHERE
            published_item_id = $1
          ;
        `,
        values,
      };

      const response: QueryResult<{ publishing_channel_id: string; name: string }> =
        await this.datastorePool.query(query);

      const rows = response.rows;

      return Success(rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelSubmissionsTableService.getPublishingChannelsAssociatedWithPublishedItemId",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async approvePendingChannelSubmission({
    controller,
    publishingChannelSubmissionId,
    timestampOfResolutionDecision,
  }: {
    controller: Controller;
    publishingChannelSubmissionId: string;
    timestampOfResolutionDecision: number;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelSubmission>
  > {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [
          { field: "is_pending", value: "false" },
          {
            field: "timestamp_of_resolution_decision",
            value: timestampOfResolutionDecision,
          },
        ],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "publishing_channel_submission_id",
            value: publishingChannelSubmissionId,
          },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPublishingChannelSubmission> =
        await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(rows[0]);
      }
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "User not found.",
        additionalErrorInformation:
          "Error at PublishingChannelSubmissionsTableService.approvePendingChannelSubmission",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelSubmissionsTableService.approvePendingChannelSubmission",
      });
    }
  }

  public async rejectPendingChannelSubmissionWithReasonString({
    controller,
    publishingChannelSubmissionId,
    reasonForRejectedSubmission,
    timestampOfResolutionDecision,
  }: {
    controller: Controller;
    publishingChannelSubmissionId: string;
    reasonForRejectedSubmission: string;
    timestampOfResolutionDecision: number;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelSubmission>
  > {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [
          { field: "is_pending", value: "false" },
          { field: "reason_for_rejected_submission", value: reasonForRejectedSubmission },
          {
            field: "timestamp_of_resolution_decision",
            value: timestampOfResolutionDecision,
          },
        ],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "publishing_channel_submission_id",
            value: publishingChannelSubmissionId,
          },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBPublishingChannelSubmission> =
        await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(rows[0]);
      }
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "User not found.",
        additionalErrorInformation:
          "Error at PublishingChannelSubmissionsTableService.rejectPendingChannelSubmissionWithReasonString",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelSubmissionsTableService.rejectPendingChannelSubmissionWithReasonString",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePublishingChannelSubmission({
    controller,
    publishingChannelSubmissionId,
  }: {
    controller: Controller;
    publishingChannelSubmissionId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelSubmission>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          {
            field: "publishing_channel_submission_id",
            value: publishingChannelSubmissionId,
          },
        ],
        tableName: this.tableName,
      });

      const response = await this.datastorePool.query<DBPublishingChannelSubmission>(
        query,
      );
      return Success(response.rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelSubmissionsTableService.deletePublishingChannelSubmission",
      });
    }
  }
}
