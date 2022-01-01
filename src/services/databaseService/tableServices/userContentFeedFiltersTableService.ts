import { Pool, QueryResult } from "pg";
import {
  UserContentFeedFilter,
  UserContentFeedFilterType,
} from "src/controllers/feed/models";

import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import { generatePSQLGenericDeleteRowsQueryString } from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

interface DBUserContentFeedFilter {
  content_feed_filter_id: string;
  user_id: string;
  type: string;
  value: string;
  creation_timestamp: string;
}

function convertDBUserContentFeedFilterToUserContentFeedFilter(
  dbUserContentFeedFilter: DBUserContentFeedFilter,
): UserContentFeedFilter {
  let type: UserContentFeedFilterType;
  if (dbUserContentFeedFilter.type === "HASHTAG") {
    type = UserContentFeedFilterType.HASHTAG;
  } else if (dbUserContentFeedFilter.type === "USERNAME") {
    type = UserContentFeedFilterType.USERNAME;
  } else {
    throw new Error("Invalid UserContentFeedFilterType");
  }

  return {
    contentFeedFilterId: dbUserContentFeedFilter.content_feed_filter_id,
    userId: dbUserContentFeedFilter.user_id,
    type,
    value: dbUserContentFeedFilter.value,
    creationTimestamp: parseInt(dbUserContentFeedFilter.creation_timestamp),
  };
}

export class UserContentFeedFiltersTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_user_content_feed_filters`;
  public readonly tableName = UserContentFeedFiltersTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        content_feed_filter_id VARCHAR(64) UNIQUE NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        type VARCHAR(64) NOT NULL,
        value VARCHAR(64) NOT NULL,
        creation_timestamp BIGINT NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createUserContentFeedFilters({
    userContentFeedFilters,
  }: {
    userContentFeedFilters: {
      contentFeedFilterId: string;
      userId: string;
      type: string;
      value: string;
      creationTimestamp: number;
    }[];
  }): Promise<void> {
    const rowsOfFieldsAndValues = userContentFeedFilters.map(
      ({ contentFeedFilterId, userId, type, value, creationTimestamp }) => [
        { field: "content_feed_filter_id", value: contentFeedFilterId },
        { field: "user_id", value: userId },
        { field: "type", value: type },
        { field: "value", value: value },
        { field: "creation_timestamp", value: creationTimestamp },
      ],
    );

    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues,
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getUserContentFeedFiltersByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<UserContentFeedFilter[]> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          user_id = $1
        ORDER BY
          creation_timestamp
        ;
      `,
      values: [userId],
    };

    const response: QueryResult<DBUserContentFeedFilter> = await this.datastorePool.query(
      query,
    );

    return response.rows.map(convertDBUserContentFeedFilterToUserContentFeedFilter);
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deleteUserContentFeedFiltersByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<UserContentFeedFilter> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [{ field: "user_id", value: userId }],
      tableName: this.tableName,
    });

    const response: QueryResult<DBUserContentFeedFilter> = await this.datastorePool.query(
      query,
    );

    const rows = response.rows;

    if (!!rows.length) {
      const row = response.rows[0];
      return convertDBUserContentFeedFilterToUserContentFeedFilter(row);
    }

    throw new Error("No rows deleted");
  }
}
