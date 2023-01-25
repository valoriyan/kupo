/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryResult } from "pg";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { TableService } from "../models";
import { generatePSQLGenericDeleteRowsQueryString } from "../utilities";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { UsersTableService } from "../users/usersTableService";
import { PublishingChannelsTableService } from "./publishingChannelsTableService";

interface DBPublishingChannelInvitation {
  publishing_channel_invitation_id: string;

  user_id_being_invited: string;
  user_id_sending_invitation: string;
  publishing_channel_id: string;
  creation_timestamp: string;
}

export class PublishingChannelInvitationsTableService extends TableService {
  public static readonly tableName = `publishing_channel_invitations`;
  public readonly tableName = PublishingChannelInvitationsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [
    UsersTableService.tableName,
    PublishingChannelsTableService.tableName,
  ];

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        publishing_channel_invitation_id VARCHAR(64) NOT NULL,

        user_id_being_invited VARCHAR(64) NOT NULL,
        user_id_sending_invitation VARCHAR(64) NOT NULL,
        publishing_channel_id VARCHAR(64) NOT NULL,
        creation_timestamp BIGINT NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (publishing_channel_invitation_id),

        CONSTRAINT ${this.tableName}_${UsersTableService.tableName}_fkey
          FOREIGN KEY (user_id_being_invited)
          REFERENCES ${UsersTableService.tableName} (user_id)
          ON DELETE CASCADE,

        CONSTRAINT ${this.tableName}_${PublishingChannelsTableService.tableName}_fkey
          FOREIGN KEY (publishing_channel_id)
          REFERENCES ${PublishingChannelsTableService.tableName} (publishing_channel_id)
          ON DELETE CASCADE
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPublishingChannelInvitation({
    controller,
    publishingChannelInvitationId,
    userIdBeingInvited,
    userIdSendingInvitation,
    publishingChannelId,
    creationTimestamp,
  }: {
    controller: Controller;
    publishingChannelInvitationId: string;
    userIdBeingInvited: string;
    userIdSendingInvitation: string;
    publishingChannelId: string;
    creationTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            {
              field: "publishing_channel_invitation_id",
              value: publishingChannelInvitationId,
            },
            {
              field: "user_id_being_invited",
              value: userIdBeingInvited,
            },
            {
              field: "user_id_sending_invitation",
              value: userIdSendingInvitation,
            },
            {
              field: "publishing_channel_id",
              value: publishingChannelId,
            },
            { field: "creation_timestamp", value: creationTimestamp },
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
          "Error at PublishingChannelInvitationsTableService.createPublishingChannelInvitation",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPublishingChannelInvitationById({
    controller,
    publishingChannelInvitationId,
  }: {
    controller: Controller;
    publishingChannelInvitationId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelInvitation>
  > {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${PublishingChannelInvitationsTableService.tableName}
          WHERE
            publishing_channel_invitation_id = $1
          ;
        `,
        values: [publishingChannelInvitationId],
      };

      const response: QueryResult<DBPublishingChannelInvitation> =
        await this.datastorePool.query(query);
      const rows = response.rows;

      return Success(rows[0]);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelInvitationsTableService.getPublishingChannelInvitationById",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePublishingChannelInvitationsByUserIdAndPublishingChannelId({
    controller,
    userIdBeingInvited,
    publishingChannelId,
  }: {
    controller: Controller;
    userIdBeingInvited: string;
    publishingChannelId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, DBPublishingChannelInvitation[]>
  > {
    try {
      const query = generatePSQLGenericDeleteRowsQueryString({
        fieldsUsedToIdentifyRowsToDelete: [
          { field: "user_id_being_invited", value: userIdBeingInvited },
          {
            field: "publishing_channel_id",
            value: publishingChannelId,
          },
        ],
        tableName: this.tableName,
      });

      const response = await this.datastorePool.query<DBPublishingChannelInvitation>(
        query,
      );
      return Success(response.rows);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at PublishingChannelInvitationsTableService.deletePublishingChannelInvitationsByUserIdAndPublishingChannelId",
      });
    }
  }
}
