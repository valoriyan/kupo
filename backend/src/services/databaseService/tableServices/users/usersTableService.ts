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
        short_bio VARCHAR(64),
        user_website VARCHAR(64),
        encrypted_password VARCHAR(64) NOT NULL,
        profile_privacy_setting enumerated_profile_privacy_setting,
        background_image_blob_file_key VARCHAR(64) UNIQUE,
        profile_picture_blob_file_key VARCHAR(64) UNIQUE,
        
        preferred_page_primary_color_red SMALLINT,
        preferred_page_primary_color_green SMALLINT,
        preferred_page_primary_color_blue SMALLINT,
        
        payment_processor_customer_id VARCHAR(64) UNIQUE NOT NULL,

        is_admin boolean NOT NULL,

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

  public async selectUserIdByUsername({
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

  public async selectUserByUsername({
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
          "Error at usersTableService.selectUsersByUsernameMatchingSubstring",
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

  public async selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID({
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

  public async selectUserByEmail({
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
          { field: "short_bio", value: shortBio, settings: { includeIfEmpty: true } },
          {
            field: "user_website",
            value: userWebsite,
            settings: { includeIfEmpty: true },
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

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
