/* eslint-disable @typescript-eslint/ban-types */
import { Pool, QueryConfig, QueryResult } from "pg";
import { Color } from "../../../../types/color";
import {
  ProfilePrivacySetting,
  UnrenderableUser,
  UnrenderableUser_WITH_PASSWORD,
  UnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID,
} from "../../../../controllers/user/models";
import { TableService } from "../models";
import {
  generatePostgreSQLCreateEnumTypeQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "../utilities/index";
import { generatePSQLGenericCreateRowsQuery } from "../utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { GenericResponseFailedReason } from "../../../../controllers/models";
import { Controller } from "tsoa";
import { UserFollowsTableService } from "./userFollowsTableService";
import { UserBlocksTableService } from "./userBlocksTable";

interface DBUser {
  user_id: string;
  email: string;
  username: string;
  short_bio?: string;
  user_website?: string;
  phone_number?: string;
  encrypted_password?: string;

  profile_privacy_setting: ProfilePrivacySetting;

  background_image_blob_file_key?: string;
  profile_picture_blob_file_key?: string;

  preferred_page_primary_color_red?: number;
  preferred_page_primary_color_green?: number;
  preferred_page_primary_color_blue?: number;

  payment_processor_customer_id: string;

  is_admin: boolean;

  has_verified_email: boolean;

  creation_timestamp: string;
}

function convertDBUserToUnrenderableUser(dbUser: DBUser): UnrenderableUser {
  let preferredPagePrimaryColor: Color | undefined = undefined;

  if (
    dbUser.preferred_page_primary_color_red !== undefined &&
    dbUser.preferred_page_primary_color_red !== null &&
    dbUser.preferred_page_primary_color_green !== undefined &&
    dbUser.preferred_page_primary_color_red !== null &&
    dbUser.preferred_page_primary_color_blue !== undefined &&
    dbUser.preferred_page_primary_color_red !== null
  ) {
    preferredPagePrimaryColor = {
      red: dbUser.preferred_page_primary_color_red,
      green: dbUser.preferred_page_primary_color_green,
      blue: dbUser.preferred_page_primary_color_blue,
    };
  }

  return {
    userId: dbUser.user_id,
    email: dbUser.email,
    username: dbUser.username,
    shortBio: dbUser.short_bio,
    userWebsite: dbUser.user_website,
    phoneNumber: dbUser.phone_number,
    profilePrivacySetting: dbUser.profile_privacy_setting,
    backgroundImageBlobFileKey: dbUser.background_image_blob_file_key,
    profilePictureBlobFileKey: dbUser.profile_picture_blob_file_key,
    preferredPagePrimaryColor,
    creationTimestamp: parseInt(dbUser.creation_timestamp),
    isAdmin: dbUser.is_admin,
    hasVerifiedEmail: dbUser.has_verified_email,
  };
}

function convertDBUserToUnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
  dbUser: DBUser,
): UnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID {
  return {
    ...convertDBUserToUnrenderableUser(dbUser),
    paymentProcessorCustomerId: dbUser.payment_processor_customer_id,
  };
}

function convertDBUserToUnrenderableUser_WITH_PASSWORD(
  dbUser: DBUser,
): UnrenderableUser_WITH_PASSWORD {
  return {
    ...convertDBUserToUnrenderableUser(dbUser),
    encryptedPassword: dbUser.encrypted_password,
  };
}

export class UsersTableService extends TableService {
  public static readonly tableName = `users`;
  public readonly tableName = UsersTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public dependencies = [];

  public async setup(): Promise<void> {
    const queryString = `
      ${generatePostgreSQLCreateEnumTypeQueryString({
        typeName: "enumerated_profile_privacy_setting",
        enumValues: ["Public", "Private"],
      })}

      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        user_id VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        short_bio VARCHAR(256),
        user_website VARCHAR(256),
        encrypted_password VARCHAR(64) NOT NULL,
        profile_privacy_setting enumerated_profile_privacy_setting,
        background_image_blob_file_key VARCHAR(64) UNIQUE,
        profile_picture_blob_file_key VARCHAR(64) UNIQUE,
        
        preferred_page_primary_color_red SMALLINT,
        preferred_page_primary_color_green SMALLINT,
        preferred_page_primary_color_blue SMALLINT,
        
        payment_processor_customer_id VARCHAR(64) UNIQUE NOT NULL,

        is_admin boolean NOT NULL,

        has_verified_email boolean NOT NULL,

        creation_timestamp BIGINT NOT NULL,

        CONSTRAINT ${this.tableName}_pkey
          PRIMARY KEY (user_id)

      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  public async teardown(): Promise<void> {
    const queryString = `
      DROP TABLE IF EXISTS ${this.tableName};
      DROP TYPE IF EXISTS enumerated_profile_privacy_setting;
    `;
    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createUser({
    controller,
    userId,
    email,
    username,
    encryptedPassword,
    paymentProcessorCustomerId,
    creationTimestamp,
    isAdmin,
  }: {
    controller: Controller;
    userId: string;
    email: string;
    username: string;
    encryptedPassword: string;
    paymentProcessorCustomerId: string;
    creationTimestamp: number;
    isAdmin?: boolean;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const is_admin_value = !!isAdmin ? "true" : "false";

      const query = generatePSQLGenericCreateRowsQuery<string | number>({
        rowsOfFieldsAndValues: [
          [
            { field: "user_id", value: userId },
            { field: "email", value: email },
            { field: "username", value: username },
            { field: "encrypted_password", value: encryptedPassword },
            { field: "profile_privacy_setting", value: ProfilePrivacySetting.Public },

            { field: "payment_processor_customer_id", value: paymentProcessorCustomerId },

            { field: "creation_timestamp", value: creationTimestamp },

            { field: "is_admin", value: is_admin_value },
            { field: "has_verified_email", value: "false" },
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
        additionalErrorInformation: "Error at usersTableService.createUser",
      });
    }
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async selectUser_WITH_PASSWORD_ByEmail({
    controller,
    email,
  }: {
    controller: Controller;
    email: string;
  }): Promise<
    InternalServiceResponse<
      ErrorReasonTypes<string>,
      UnrenderableUser_WITH_PASSWORD | undefined
    >
  > {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            email = $1
          LIMIT
            1
          ;
        `,
        values: [email],
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(convertDBUserToUnrenderableUser_WITH_PASSWORD(rows[0]));
      }
      return Success(undefined);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at usersTableService.selectUser_WITH_PASSWORD_ByEmail",
      });
    }
  }

  public async getMaybeUserIdByUsername({
    controller,
    username,
  }: {
    controller: Controller;
    username: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string | undefined>> {
    try {
      const response: QueryResult<Pick<DBUser, "user_id">> =
        await this.datastorePool.query({
          text: `
          SELECT
            user_id
          FROM
            ${this.tableName}
          WHERE
            username = $1
          LIMIT
            1
          ;
        `,
          values: [username],
        });

      if (!response.rows[0]) return Success(undefined);

      return Success(response.rows[0].user_id);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.selectUserIdByUsername",
      });
    }
  }

  public async selectMaybeUserByUsername({
    controller,
    username,
  }: {
    controller: Controller;
    username: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser | undefined>
  > {
    try {
      const queryString = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            username = $1
          LIMIT
            1
          ;
        `,
        values: [username],
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(queryString);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(convertDBUserToUnrenderableUser(rows[0]));
      }
      return Success(undefined);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.selectUserByUsername",
      });
    }
  }

  public async selectUsersByUsernames({
    controller,
    usernames,
  }: {
    controller: Controller;
    usernames: string[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser[]>> {
    try {
      if (usernames.length === 0) {
        return Success([]);
      }

      const usernamesQueryText = usernames
        .map((_, index) => {
          return `$${index + 1}`;
        })
        .join(", ");

      const queryString = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            username IN ( ${usernamesQueryText} )
          ;
        `,
        values: usernames,
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(queryString);

      const rows = response.rows;

      return Success(rows.map(convertDBUserToUnrenderableUser));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.selectUsersByUsernames",
      });
    }
  }

  public async selectUsersBySearchString({
    controller,
    searchString,
  }: {
    controller: Controller;
    searchString: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser[]>> {
    try {
      const query: QueryConfig = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            short_bio LIKE CONCAT('%', $1::text, '%') OR
            username LIKE CONCAT('%', $1::text, '%')
          ;
        `,
        values: [searchString],
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      return Success(response.rows.map(convertDBUserToUnrenderableUser));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at usersTableService.selectUsersBySearchString",
      });
    }
  }

  public async selectUsersByUsernameMatchingSubstring({
    controller,
    usernameSubstring,
    limit,
  }: {
    controller: Controller;
    usernameSubstring: string;
    limit?: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser[]>> {
    const values: Array<string | number> = [usernameSubstring];
    if (limit) values.push(limit);

    try {
      const query: QueryConfig = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            username LIKE CONCAT('%', $1::text, '%' )
          ${limit ? "LIMIT $2" : ""}
          ;
        `,
        values: [usernameSubstring, limit],
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      const rows = response.rows;

      return Success(rows.map(convertDBUserToUnrenderableUser));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at usersTableService.selectUsersByUsernameMatchingSubstring",
      });
    }
  }

  // Strategy 2 is to prioritize usernames starting with the provided substring
  public async selectUsersByUsernameMatchingSubstringStrategy2({
    controller,
    usernameSubstring,
  }: {
    controller: Controller;
    usernameSubstring: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser[]>> {
    try {
      const query: QueryConfig = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            username LIKE CONCAT('%', $1::text, '%' )
          ORDER BY
            username LIKE CONCAT($1::text, '%' )
            DESC
          ;
        `,
        values: [usernameSubstring],
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      const rows = response.rows;

      return Success(rows.map(convertDBUserToUnrenderableUser));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at usersTableService.selectUsersByUsernameMatchingSubstringStrategy2",
      });
    }
  }

  public async selectMaybeUserByUserId({
    controller,
    userId,
  }: {
    controller: Controller;
    userId: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser | undefined>
  > {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id = $1
          ;
        `,
        values: [userId],
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(convertDBUserToUnrenderableUser(rows[0]));
      }
      return Success(undefined);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.selectUserByUserId",
      });
    }
  }

  public async selectMaybeUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID({
    controller,
    userId,
  }: {
    controller: Controller;
    userId: string;
  }): Promise<
    InternalServiceResponse<
      ErrorReasonTypes<string>,
      UnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID | undefined
    >
  > {
    try {
      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id = $1
          ;
        `,
        values: [userId],
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(
          convertDBUserToUnrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(rows[0]),
        );
      }
      return Success(undefined);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at usersTableService.selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID",
      });
    }
  }

  public async selectUsersByUserIds({
    controller,
    userIds,
  }: {
    controller: Controller;
    userIds: string[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser[]>> {
    try {
      const filteredUserIds = userIds.filter((userId) => !!userId);

      if (filteredUserIds.length === 0) {
        return Success([]);
      }

      const userIdsQueryText = filteredUserIds
        .map((_, index) => {
          return `$${index + 1}`;
        })
        .join(", ");

      const query = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            user_id IN ( ${userIdsQueryText} )
          ;
        `,
        values: filteredUserIds,
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      const rows = response.rows;

      return Success(rows.map(convertDBUserToUnrenderableUser));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.selectUsersByUserIds",
      });
    }
  }

  public async selectMaybeUserByEmail({
    controller,
    email,
  }: {
    controller: Controller;
    email: string;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser | undefined>
  > {
    try {
      const queryString = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            email = $1
          LIMIT
            1
          ;
        `,
        values: [email],
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(queryString);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(convertDBUserToUnrenderableUser(rows[0]));
      }
      return Success(undefined);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.selectUserByEmail",
      });
    }
  }

  public async determineWhichBlobFileKeysExist({
    controller,
    blobFileKeys,
  }: {
    controller: Controller;
    blobFileKeys: string[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string[]>> {
    try {
      const values: (string | number)[] = [];

      let backgroundBlobFileKeysCondition = "";
      backgroundBlobFileKeysCondition += `OR background_image_blob_file_key IN  ( `;

      const backgroundExecutorIdParameterStrings: string[] = [];
      blobFileKeys.forEach((blobFileKey) => {
        backgroundExecutorIdParameterStrings.push(`$${values.length + 1}`);
        values.push(blobFileKey);
      });
      backgroundBlobFileKeysCondition += backgroundExecutorIdParameterStrings.join(", ");
      backgroundBlobFileKeysCondition += ` )`;

      let profilePictureBlobFileKeysCondition = "";
      profilePictureBlobFileKeysCondition += `OR profile_picture_blob_file_key IN  ( `;

      const profilePictureExecutorIdParameterStrings: string[] = [];
      blobFileKeys.forEach((blobFileKey) => {
        profilePictureExecutorIdParameterStrings.push(`$${values.length + 1}`);
        values.push(blobFileKey);
      });
      profilePictureBlobFileKeysCondition +=
        profilePictureExecutorIdParameterStrings.join(", ");
      profilePictureBlobFileKeysCondition += ` )`;

      const queryString = {
        text: `
          SELECT
            *
          FROM
            ${this.tableName}
          WHERE
            FALSE
            ${backgroundBlobFileKeysCondition}
            ${profilePictureBlobFileKeysCondition}
          ;
        `,
        values,
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(queryString);

      const existingBackgroundBlobFileKeys = response.rows.map(
        (row) => row.background_image_blob_file_key,
      );
      const existingProfilePictureBlobFileKeys = response.rows.map(
        (row) => row.profile_picture_blob_file_key,
      );

      const existingBlobFileKeys = Array.from(
        existingBackgroundBlobFileKeys.concat(existingProfilePictureBlobFileKeys),
      ).filter((maybeBlobFileKey) => !!maybeBlobFileKey) as string[];

      return Success(existingBlobFileKeys);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at usersTableService.determineWhichBlobFileKeysExist",
      });
    }
  }

  public async getMostFollowedUsersNotFollowedByTargetUser({
    controller,
    targetUserId,
    limit,
  }: {
    controller: Controller;
    targetUserId: string;
    limit: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser[]>> {
    try {
      const values: (string | number)[] = [];
      values.push(targetUserId);

      //////////////////////////////////////////////////
      // Limit Clause
      //////////////////////////////////////////////////
      const limitClause = `
        LIMIT $${values.length + 1}
      `;
      values.push(limit);

      const queryString = {
        text: `
          SELECT
            ${UsersTableService.tableName}.*
          FROM
            ${UsersTableService.tableName}
          WHERE
              ${UsersTableService.tableName}.user_id IN (
                --------------------------------------------------
                -- Users Ranked By Following Count
                --------------------------------------------------	
                SELECT
                  ${UsersTableService.tableName}.user_id
                FROM
                  ${UserFollowsTableService.tableName}
                RIGHT JOIN
                    ${UsersTableService.tableName}
                  ON
                    ${UserFollowsTableService.tableName}.user_id_being_followed = ${UsersTableService.tableName}.user_id
                WHERE
                    ${UsersTableService.tableName}.user_id != $1
                  AND
                    ${UsersTableService.tableName}.user_id NOT IN (
                      --------------------------------------------------
                      -- User Ids Being Followed By Target
                      --------------------------------------------------
                      SELECT
                        ${UserFollowsTableService.tableName}.user_id_being_followed
                      FROM
                        ${UserFollowsTableService.tableName}
                      WHERE
                        ${UserFollowsTableService.tableName}.user_id_doing_following = $1
                    )
                GROUP BY
                  ${UsersTableService.tableName}.user_id
                ORDER BY
                  COUNT(${UserFollowsTableService.tableName}.user_id_being_followed)
                  DESC
              )
            AND
              ${UsersTableService.tableName}.user_id NOT IN (
                --------------------------------------------------
                -- Users Blocked By Target
                --------------------------------------------------	
                SELECT
                  ${UserBlocksTableService.tableName}.executor_user_id as user_id
                FROM
                  ${UserBlocksTableService.tableName}
                WHERE
                    ${UserBlocksTableService.tableName}.blocked_user_id = $1	
              )
            AND
              ${UsersTableService.tableName}.user_id NOT IN (
                --------------------------------------------------
                -- Users Being Blocked By Target
                --------------------------------------------------	
                SELECT
                  ${UserBlocksTableService.tableName}.blocked_user_id as user_id
                FROM
                  ${UserBlocksTableService.tableName}
                WHERE
                    ${UserBlocksTableService.tableName}.executor_user_id = $1
              )
          ${limitClause}
          ;
        `,
        values,
      };

      const response: QueryResult<DBUser> = await this.datastorePool.query(queryString);

      return Success(response.rows.map(convertDBUserToUnrenderableUser));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation:
          "Error at usersTableService.getMostFollowedUsersNotFollowedByTargetUser",
      });
    }
  }

  public async countNewUsersInTimerange({
    controller,
    startTimestamp,
    endTimestamp,
  }: {
    controller: Controller;
    startTimestamp: number;
    endTimestamp: number;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, number>> {
    try {
      const values: (string | number)[] = [];
      values.push(startTimestamp);
      values.push(endTimestamp);

      const queryString = {
        text: `
          SELECT
            COUNT(*)
          FROM
            users
          WHERE
            users.creation_timestamp > $1
          AND
            users.creation_timestamp < $2
          ;
        `,
        values,
      };

      const response: QueryResult<{ count: string }> = await this.datastorePool.query(
        queryString,
      );

      return Success(parseInt(response.rows[0].count));
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.countNewUsersInTimerange",
      });
    }
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateUserPassword({
    controller,
    userId,
    encryptedPassword,
  }: {
    controller: Controller;
    userId: string;
    encryptedPassword: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [{ field: "encrypted_password", value: encryptedPassword }],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "user_id",
            value: userId,
          },
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
        additionalErrorInformation: "Error at usersTableService.updateUserPassword",
      });
    }
  }

  public async updateUserByUserId({
    controller,

    userId,
    username,
    shortBio,
    userWebsite,
    email,
    phoneNumber,
    profilePrivacySetting,
    backgroundImageBlobFileKey,
    profilePictureBlobFileKey,
    preferredPagePrimaryColor,
  }: {
    controller: Controller;

    userId: string;
    username?: string;
    shortBio?: string;
    userWebsite?: string;
    email?: string;
    phoneNumber?: string;
    profilePrivacySetting?: ProfilePrivacySetting;
    backgroundImageBlobFileKey?: string;
    profilePictureBlobFileKey?: string;
    preferredPagePrimaryColor?: Color;
  }): Promise<
    InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser | undefined>
  > {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [
          { field: "username", value: username },
          {
            field: "short_bio",
            value: shortBio,
            settings: { includeWheneverNotUndefined: true },
          },
          {
            field: "user_website",
            value: userWebsite,
            settings: { includeWheneverNotUndefined: true },
          },
          {
            field: "email",
            value: email,
          },
          {
            field: "phone_number",
            value: phoneNumber,
          },
          { field: "profile_privacy_setting", value: profilePrivacySetting },
          { field: "background_image_blob_file_key", value: backgroundImageBlobFileKey },
          { field: "profile_picture_blob_file_key", value: profilePictureBlobFileKey },
          {
            field: "preferred_page_primary_color_red",
            value: preferredPagePrimaryColor?.red,
          },
          {
            field: "preferred_page_primary_color_green",
            value: preferredPagePrimaryColor?.green,
          },
          {
            field: "preferred_page_primary_color_blue",
            value: preferredPagePrimaryColor?.blue,
          },
        ],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "user_id",
            value: userId,
          },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(convertDBUserToUnrenderableUser(rows[0]));
      }

      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "User not found.",
        additionalErrorInformation: "Error at usersTableService.updateUserByUserId",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.updateUserByUserId",
      });
    }
  }

  public async elevateUserToAdmin({
    controller,
    userId,
  }: {
    controller: Controller;
    userId: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser>> {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [{ field: "is_admin", value: "true" }],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "user_id",
            value: userId,
          },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(convertDBUserToUnrenderableUser(rows[0]));
      }
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "User not found.",
        additionalErrorInformation: "Error at usersTableService.elevateUserToAdmin",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.elevateUserToAdmin",
      });
    }
  }

  public async verifyUserEmail({
    controller,
    userId,
    email,
  }: {
    controller: Controller;
    userId: string;
    email: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, UnrenderableUser>> {
    try {
      const query = generatePSQLGenericUpdateRowQueryString<string | number>({
        updatedFields: [{ field: "has_verified_email", value: "true" }],
        fieldsUsedToIdentifyUpdatedRows: [
          {
            field: "user_id",
            value: userId,
          },
          {
            field: "email",
            value: email,
          },
        ],
        tableName: this.tableName,
      });

      const response: QueryResult<DBUser> = await this.datastorePool.query(query);

      const rows = response.rows;

      if (rows.length === 1) {
        return Success(convertDBUserToUnrenderableUser(rows[0]));
      }
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error: "User not found.",
        additionalErrorInformation: "Error at usersTableService.verifyUserEmail",
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        error,
        additionalErrorInformation: "Error at usersTableService.verifyUserEmail",
      });
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
