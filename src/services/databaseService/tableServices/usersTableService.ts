import { Pool, QueryResult } from "pg";
import {
  ProfilePrivacySetting,
  UnrenderableUser,
  UnrenderableUser_WITH_PASSWORD,
} from "../../../controllers/user/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePostgreSQLCreateEnumTypeQueryString,
  generatePSQLGenericCreateRowQueryString,
} from "./utilities";

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
        userWser_website VARCHAR(64),
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
    const queryString = generatePSQLGenericCreateRowQueryString<string | number>({
      rows: [
        { field: "user_id", value: userId },
        { field: "email", value: email },
        { field: "username", value: username },
        { field: "encrypted_password", value: encryptedPassword },
        { field: "profile_privacy_setting", value: ProfilePrivacySetting.Public },
      ],
      tableName: this.tableName,
    });

    await this.datastorePool.query(queryString);
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  public async selectUser_WITH_PASSWORD_ByUsername({
    username,
  }: {
    username: string;
  }): Promise<UnrenderableUser_WITH_PASSWORD | undefined> {
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          username = '${username}'
        LIMIT
          1
        ;
      `;

    const response: QueryResult<DBUser> = await this.datastorePool.query(queryString);

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
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          username = '${username}'
        LIMIT
          1
        ;
      `;

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
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          username LIKE '%${usernameSubstring}%'
        ;
      `;

    const response: QueryResult<DBUser> = await this.datastorePool.query(queryString);

    const rows = response.rows;

    return rows.map(convertDBUserToUnrenderableUser);
  }

  public async selectUserByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<UnrenderableUser | undefined> {
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          user_id = '${userId}'
        LIMIT
          1
        ;
      `;

    const response: QueryResult<DBUser> = await this.datastorePool.query(queryString);

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
    if (
      [
        username,
        shortBio,
        userWebsite,
        profilePrivacySetting,
        backgroundImageBlobFileKey,
        profilePictureBlobFileKey,
      ].some((value) => !!value)
    ) {
      let updateString = "";
      if (!!username) {
        updateString += `
          username = '${username}'
        `;
      }
      if (!!shortBio) {
        updateString += `
          short_bio = '${shortBio}'
        `;
      }

      if (!!userWebsite) {
        updateString += `
          user_website = '${userWebsite}'
        `;
      }

      if (!!profilePrivacySetting) {
        updateString += `
          profile_privacy_setting = '${profilePrivacySetting}'
        `;
      }

      if (!!backgroundImageBlobFileKey) {
        updateString += `
          background_image_blob_file_key = '${backgroundImageBlobFileKey}'
        `;
      }

      if (!!profilePictureBlobFileKey) {
        updateString += `
          profile_picture_blob_file_key = '${profilePictureBlobFileKey}'
        `;
      }

      const queryString = `
          UPDATE
            ${this.tableName}
          SET
            ${updateString}
          WHERE
            user_id = '${userId}'
          ;
        `;

      await this.datastorePool.query(queryString);
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
