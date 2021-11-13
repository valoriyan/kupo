import { Pool, QueryConfig, QueryResult } from "pg";
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
  encrypted_password?: string;

  profile_privacy_setting: ProfilePrivacySetting;

  background_image_blob_file_key?: string;
  profile_picture_blob_file_key?: string;
}

function convertDBUserToUnrenderableUser(dbUser: DBUser): UnrenderableUser {
  return {
    userId: dbUser.user_id,
    email: dbUser.email,
    username: dbUser.username,
    shortBio: dbUser.short_bio,
    userWebsite: dbUser.user_website,
    profilePrivacySetting: dbUser.profile_privacy_setting,
    backgroundImageBlobFileKey: dbUser.background_image_blob_file_key,
    profilePictureBlobFileKey: dbUser.profile_picture_blob_file_key,
  };
}

function convertDBUserToUnrenderableUserWITHPASSWORD(
  dbUser: DBUser,
): UnrenderableUser_WITH_PASSWORD {
  return {
    userId: dbUser.user_id,
    email: dbUser.email,
    username: dbUser.username,
    shortBio: dbUser.short_bio,
    userWebsite: dbUser.user_website,
    profilePrivacySetting: dbUser.profile_privacy_setting,
    backgroundImageBlobFileKey: dbUser.background_image_blob_file_key,
    profilePictureBlobFileKey: dbUser.profile_picture_blob_file_key,
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
        profile_picture_blob_file_key VARCHAR(64) UNIQUE
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

    console.log("query");
    console.log(query.text);
    console.log(query.values);

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

    console.log(query.text);
    console.log(query.values);

    const response: QueryResult<DBUser> = await this.datastorePool.query(query);

    const rows = response.rows;

    return rows.map(convertDBUserToUnrenderableUser);
  }

  public async selectUserByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<UnrenderableUser | undefined> {
    console.log(`${this.tableName} | selectUserByUserId`);

    const query = {
      text: `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          user_id = $1
        LIMIT
          1
        ;
      `,
      values: [userId],
    };

    console.log(query.text);
    console.log(query.values);

    const response: QueryResult<DBUser> = await this.datastorePool.query(query);

    const rows = response.rows;

    if (!!rows[0]) {
      return convertDBUserToUnrenderableUser(rows[0]);
    }
    return;
  }

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  public async updateUserByUserId({
    userId,

    username,
    shortBio,
    userWebsite,
    profilePrivacySetting,
    backgroundImageBlobFileKey,
    profilePictureBlobFileKey,
  }: {
    userId: string;

    username?: string;
    shortBio?: string;
    userWebsite?: string;
    profilePrivacySetting?: ProfilePrivacySetting;
    backgroundImageBlobFileKey?: string;
    profilePictureBlobFileKey?: string;
  }): Promise<void> {
    const query = generatePSQLGenericUpdateRowQueryString<string | number>({
      updatedFields: [
        { field: "username", value: username },
        { field: "short_bio", value: shortBio },
        {
          field: "user_website",
          value: userWebsite,
        },
        { field: "profile_privacy_setting", value: profilePrivacySetting },
        { field: "background_image_blob_file_key", value: backgroundImageBlobFileKey },
        { field: "profile_picture_blob_file_key", value: profilePictureBlobFileKey },
      ],
      fieldUsedToIdentifyUpdatedRow: {
        field: "user_id",
        value: userId,
      },
      tableName: this.tableName,
    });

    await this.datastorePool.query(query);
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
