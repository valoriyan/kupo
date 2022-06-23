import { Pool, QueryConfig, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePSQLGenericDeleteRowsQueryString,
  generatePSQLGenericUpdateRowQueryString,
  isQueryEmpty,
} from "./utilities";
import { assertIsNumber } from "./utilities/validations";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import {
  PublishedItemType,
  UncompiledBasePublishedItem,
} from "../../../controllers/publishedItem/models";

interface DBPublishedItem {
  type: PublishedItemType;
  id: string;
  author_user_id: string;
  caption: string;
  creation_timestamp: string;
  scheduled_publication_timestamp: string;
  expiration_timestamp?: string;
  id_of_published_item_being_shared?: string;
}

function convertDBPublishedItemToUncompiledBasePublishedItem(
  dbPublishedItem: DBPublishedItem,
): UncompiledBasePublishedItem {
  return {
    type: dbPublishedItem.type,
    id: dbPublishedItem.id,
    authorUserId: dbPublishedItem.author_user_id,
    caption: dbPublishedItem.caption,
    creationTimestamp: parseInt(dbPublishedItem.creation_timestamp),
    scheduledPublicationTimestamp: parseInt(
      dbPublishedItem.scheduled_publication_timestamp,
    ),
    expirationTimestamp: !!dbPublishedItem.expiration_timestamp
      ? parseInt(dbPublishedItem.expiration_timestamp)
      : undefined,
    idOfPublishedItemBeingShared: dbPublishedItem.id_of_published_item_being_shared,
  };
}

export class PublishedItemsTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_published_items`;
  public readonly tableName = PublishedItemsTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        type VARCHAR(64) NOT NULL,
        id VARCHAR(64) UNIQUE NOT NULL,
        author_user_id VARCHAR(64) NOT NULL,
        caption VARCHAR(512) NOT NULL,
        creation_timestamp BIGINT NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL,
        expiration_timestamp BIGINT,
        id_of_published_item_being_shared VARCHAR(64)
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createPublishedItem({
    type,
    publishedItemId,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    idOfPublishedItemBeingShared,
  }: {
    type: PublishedItemType;
    publishedItemId: string;
    creationTimestamp: number;
    authorUserId: string;
    caption: string;
    scheduledPublicationTimestamp: number;
    expirationTimestamp?: number;
    idOfPublishedItemBeingShared?: string;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "type", value: type },
          { field: "id", value: publishedItemId },
          { field: "author_user_id", value: authorUserId },
          { field: "caption", value: caption },
          { field: "creation_timestamp", value: creationTimestamp },
          {
            field: "scheduled_publication_timestamp",
            value: scheduledPublicationTimestamp,
          },
          { field: "expiration_timestamp", value: expirationTimestamp },
          {
            field: "id_of_published_item_being_shared",
            value: idOfPublishedItemBeingShared,
          },
        ],
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async getPublishedItemsByAuthorUserId({
    authorUserId,
    filterOutExpiredAndUnscheduledPublishedItems,
    limit,
    getPublishedItemsBeforeTimestamp,
    type,
  }: {
    authorUserId: string;
    filterOutExpiredAndUnscheduledPublishedItems: boolean;
    limit?: number;
    getPublishedItemsBeforeTimestamp?: number;
    type?: PublishedItemType;
  }): Promise<UncompiledBasePublishedItem[]> {
    const queryValues: (string | number)[] = [authorUserId];
    const currentTimestamp = Date.now();

    let typeConstraintClause = "";
    if (!!type) {
      typeConstraintClause = `
        AND
          type = $${queryValues.length + 1}
      `;
      queryValues.push(type);
    }

    let filteringWhereClause = "";
    if (!!filterOutExpiredAndUnscheduledPublishedItems) {
      filteringWhereClause = `
        AND
          (
            scheduled_publication_timestamp IS NULL
              OR
            scheduled_publication_timestamp < $${queryValues.length + 1}
          ) 
        AND
          (
              expiration_timestamp IS NULL
            OR
              expiration_timestamp > $${queryValues.length + 2}
          )
      `;

      queryValues.push(currentTimestamp);
      queryValues.push(currentTimestamp);
    }

    let limitClause = "";
    if (!!limit) {
      limitClause = `
        LIMIT $${queryValues.length + 1}
      `;

      queryValues.push(limit);
    }

    let getPublishedItemsBeforeTimestampClause = "";
    if (!!getPublishedItemsBeforeTimestamp) {
      getPublishedItemsBeforeTimestampClause = `
        AND
          scheduled_publication_timestamp < $${queryValues.length + 1}
      `;

      queryValues.push(getPublishedItemsBeforeTimestamp);
    }

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          author_user_id = $1
          ${typeConstraintClause}
          ${filteringWhereClause}
          ${getPublishedItemsBeforeTimestampClause}
        ORDER BY
          scheduled_publication_timestamp DESC
        ${limitClause}
        ;
      `,
      values: queryValues,
    };

    const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem);
  }

  public async getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserId({
    creatorUserId,
    rangeEndTimestamp,
    rangeStartTimestamp,
    type,
  }: {
    creatorUserId: string;
    rangeEndTimestamp: number;
    rangeStartTimestamp: number;
    type?: PublishedItemType;
  }): Promise<UncompiledBasePublishedItem[]> {
    assertIsNumber(rangeEndTimestamp);
    assertIsNumber(rangeStartTimestamp);

    const queryValues: (string | number)[] = [
      creatorUserId,
      rangeStartTimestamp,
      rangeEndTimestamp,
    ];

    let typeConstraintClause = "";
    if (!!type) {
      typeConstraintClause = `
        AND
          type = $${queryValues.length + 1}
      `;
      queryValues.push(type);
    }

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
            author_user_id = $1
          AND
            scheduled_publication_timestamp IS NOT NULL
          AND
            scheduled_publication_timestamp >= $2
          AND
            scheduled_publication_timestamp <= $3
          ${typeConstraintClause}
        ;
      `,
      values: queryValues,
    };

    const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem);
  }

  public async getPublishedItemsByCreatorUserIds({
    creatorUserIds,
    beforeTimestamp,
    pageSize,
    type,
  }: {
    creatorUserIds: string[];
    beforeTimestamp?: number;
    pageSize: number;
    type?: PublishedItemType;
  }): Promise<UncompiledBasePublishedItem[]> {
    if (creatorUserIds.length === 0) {
      return [];
    }

    const queryValues: Array<string | number> = [...creatorUserIds, pageSize];

    let typeConstraintClause = "";
    if (!!type) {
      typeConstraintClause = `
        AND
          type = $${queryValues.length + 1}
      `;
      queryValues.push(type);
    }

    let beforeTimestampCondition = "";
    if (!!beforeTimestamp) {
      beforeTimestampCondition = `AND scheduled_publication_timestamp < $${
        queryValues.length + 1
      }`;
      queryValues.push(beforeTimestamp);
    }

    const creatorUserIdsQueryString = creatorUserIds
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          author_user_id IN (${creatorUserIdsQueryString})
          ${typeConstraintClause}
          ${beforeTimestampCondition}
        ORDER BY
          scheduled_publication_timestamp DESC
        LIMIT
          $${creatorUserIds.length + 1}
        ;
      `,
      values: queryValues,
    };

    const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem);
  }

  public async getPublishedItemById({
    id,
  }: {
    id: string;
  }): Promise<UncompiledBasePublishedItem> {
    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          id = $1
        ;
      `,
      values: [id],
    };

    const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(query);

    if (response.rows.length < 1) {
      throw new Error("Missing published item");
    }

    return convertDBPublishedItemToUncompiledBasePublishedItem(response.rows[0]);
  }

  public async getPublishedItemsByIds({
    ids,
    limit,
    getPublishedItemsBeforeTimestamp,
    restrictedToType,
  }: {
    ids: string[];
    limit?: number;
    getPublishedItemsBeforeTimestamp?: number;
    restrictedToType?: PublishedItemType;
  }): Promise<UncompiledBasePublishedItem[]> {
    const queryValues = ([] as string[]).concat(ids);

    if (ids.length === 0) {
      return [];
    }

    const idsQueryString = `( ${ids.map((_, index) => `$${index + 1}`).join(", ")} )`;

    let limitClause = "";
    if (!!limit) {
      limitClause = `
        LIMIT $${queryValues.length + 1}
      `;

      queryValues.push(limit.toString());
    }

    let getPublishedItemsBeforeTimestampClause = "";
    if (!!getPublishedItemsBeforeTimestamp) {
      getPublishedItemsBeforeTimestampClause = `
        AND
          scheduled_publication_timestamp < $${queryValues.length + 1}
      `;

      queryValues.push(getPublishedItemsBeforeTimestamp.toString());
    }

    let typeConstraintClause = "";
    if (!!restrictedToType) {
      typeConstraintClause = `
        AND
          type = $${queryValues.length + 1}
      `;
      queryValues.push(restrictedToType);
    }

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          id IN ${idsQueryString}
          ${getPublishedItemsBeforeTimestampClause}
          ${typeConstraintClause}
        ORDER BY
          scheduled_publication_timestamp DESC
        ${limitClause}
        ;
      `,
      values: queryValues,
    };

    const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(query);

    return response.rows.map(convertDBPublishedItemToUncompiledBasePublishedItem);
  }

  public async getPublishedItemsByCaptionMatchingSubstring({
    captionSubstring,
    type,
  }: {
    captionSubstring: string;
    type?: PublishedItemType;
  }): Promise<UncompiledBasePublishedItem[]> {
    const queryValues = [captionSubstring];

    let typeConstraintClause = "";
    if (!!type) {
      typeConstraintClause = `
        AND
          type = $${queryValues.length + 1}
      `;
      queryValues.push(type);
    }

    const query: QueryConfig = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          caption LIKE CONCAT('%', $1::text, '%' )
          ${typeConstraintClause}
        ;
      `,
      values: queryValues,
    };

    const response: QueryResult<DBPublishedItem> = await this.datastorePool.query(query);

    const rows = response.rows;

    return rows.map(convertDBPublishedItemToUncompiledBasePublishedItem);
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateContentItemById({
    id,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  }: {
    id: string;
    authorUserId?: string;
    caption?: string;
    scheduledPublicationTimestamp?: number;
    expirationTimestamp?: number;
  }): Promise<void> {
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [
        { field: "author_user_id", value: authorUserId },
        { field: "caption", value: caption },
        {
          field: "scheduled_publication_timestamp",
          value: scheduledPublicationTimestamp,
        },
        { field: "expirationTimestamp", value: expirationTimestamp },
      ],
      fieldUsedToIdentifyUpdatedRow: {
        field: "id",
        value: id,
      },
      tableName: this.tableName,
    });

    if (!isQueryEmpty({ query })) {
      await this.datastorePool.query(query);
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async deletePublishedItem({
    id,
    authorUserId,
  }: {
    id: string;
    authorUserId: string;
  }): Promise<void> {
    const query = generatePSQLGenericDeleteRowsQueryString({
      fieldsUsedToIdentifyRowsToDelete: [
        { field: "id", value: id },
        { field: "author_user_id", value: authorUserId },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }
}