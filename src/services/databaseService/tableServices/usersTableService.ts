import { Pool, QueryResult } from "pg";
import { ProfilePrivacySetting } from "../../../controllers/user/models";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";
import {
  generatePostgreSQLCreateEnumTypeQueryString,
  generatePSQLGenericCreateRowQueryString,
} from "./utilities";

interface DBUser {
  id: string;
  email: string;
  username: string;
  short_bio?: string;
  user_website?: string;
  encrypted_password?: string;

  profile_privacy_setting: ProfilePrivacySetting;

  background_image_blob_file_key?: string;
  profile_picture_blob_file_key?: string;
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
        id VARCHAR(64) UNIQUE NOT NULL,
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
        { field: "id", value: userId },
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

  public async selectUserByUsername({
    username,
  }: {
    username: string;
  }): Promise<DBUser | undefined> {
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

    return rows[0];
  }

  public async selectUserByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<DBUser | undefined> {
    const queryString = `
        SELECT
          *
        FROM
          ${this.tableName}
        WHERE
          id = '${userId}'
        LIMIT
          1
        ;
      `;

    const response: QueryResult<DBUser> = await this.datastorePool.query(queryString);

    const rows = response.rows;

    return rows[0];
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
            id = '${userId}'
          ;
        `;

      await this.datastorePool.query(queryString);
    }
  }

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
