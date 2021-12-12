import { map } from "bluebird";
import { Pool, QueryConfig, QueryResult } from "pg";
import { Color } from "src/types/color";
import {
  ProfilePrivacySetting,
  UnrenderableUser,
  UnrenderableUser_WITH_PASSWORD,
} from "../../../controllers/user/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePostgreSQLCreateEnumTypeQueryString,
  generatePSQLGenericUpdateRowQueryString,
} from "./utilities";
import { generatePSQLGenericCreateRowsQuery } from "./utilities/crudQueryGenerators/generatePSQLGenericCreateRowsQuery";

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
  };
}

function convertDBUserToUnrenderableUserWITHPASSWORD(
  dbUser: DBUser,
): UnrenderableUser_WITH_PASSWORD {
  return {
    ...convertDBUserToUnrenderableUser(dbUser),
    encryptedPassword: dbUser.encrypted_password,
  };
}

export class UsersTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_users`;
  public readonly tableName = UsersTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

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
        preferred_page_primary_color_blue SMALLINT
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async createUser({
    userId,
    email,
    username,
    encryptedPassword,
  }: {
    userId: string;
    email: string;
    username: string;
    encryptedPassword: string;
  }): Promise<void> {
    const query = generatePSQLGenericCreateRowsQuery<string | number>({
      rowsOfFieldsAndValues: [
        [
          { field: "user_id", value: userId },
          { field: "email", value: email },
          { field: "username", value: username },
          { field: "encrypted_password", value: encryptedPassword },
          { field: "profile_privacy_setting", value: ProfilePrivacySetting.Public },
        ],
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async selectUser_WITH_PASSWORD_ByUsername({
    username,
  }: {
    username: string;
  }): Promise<UnrenderableUser_WITH_PASSWORD | undefined> {
    const query = {
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

    const response: QueryResult<DBUser> = await this.datastorePool.query(query);

    const rows = response.rows;

    if (rows.length === 1) {
      return convertDBUserToUnrenderableUserWITHPASSWORD(rows[0]);
    }
    return;
  }

  public async selectUserByUsername({
    username,
  }: {
    username: string;
  }): Promise<UnrenderableUser | undefined> {
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
      return convertDBUserToUnrenderableUser(rows[0]);
    }
    return;
  }

  public async selectUsersByUsernames({
    usernames,
  }: {
    usernames: string[];
  }): Promise<UnrenderableUser[]> {
    if (usernames.length === 0) {
      return [];
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

    return map(rows, convertDBUserToUnrenderableUser);
  }

  public async selectUsersByUsernameMatchingSubstring({
    usernameSubstring,
  }: {
    usernameSubstring: string;
  }): Promise<UnrenderableUser[]> {
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

    return rows.map(convertDBUserToUnrenderableUser);
  }

  public async selectUserByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<UnrenderableUser | undefined> {
    console.log(`${this.tableName} | selectUsersByUserIds`);

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
      return convertDBUserToUnrenderableUser(rows[0]);
    }
    return;
  }

  public async selectUsersByUserIds({
    userIds,
  }: {
    userIds: string[];
  }): Promise<UnrenderableUser[]> {
    console.log(`${this.tableName} | selectUsersByUserIds`);

    const filteredUserIds = userIds.filter((userId) => !!userId);

    if (filteredUserIds.length === 0) {
      return [];
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

    return map(rows, convertDBUserToUnrenderableUser);
  }

  public async selectUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<UnrenderableUser | undefined> {
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
      return convertDBUserToUnrenderableUser(rows[0]);
    }
    return;
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateUserPassword({
    userId,
    encryptedPassword,
  }: {
    userId: string;
    encryptedPassword: string;
  }): Promise<void> {
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [{ field: "encrypted_password", value: encryptedPassword }],
      fieldUsedToIdentifyUpdatedRow: {
        field: "user_id",
        value: userId,
      },
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  public async updateUserByUserId({
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
  }): Promise<UnrenderableUser | undefined> {
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [
        { field: "username", value: username },
        { field: "short_bio", value: shortBio },
        {
          field: "user_website",
          value: userWebsite,
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
      fieldUsedToIdentifyUpdatedRow: {
        field: "user_id",
        value: userId,
      },
      tableName: this.tableName,
    });

    const response: QueryResult<DBUser> = await this.datastorePool.query(query);

    const rows = response.rows;

    if (rows.length === 1) {
      return convertDBUserToUnrenderableUser(rows[0]);
    }
    return;
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
