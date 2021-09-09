import { Pool, QueryResult } from "pg";
import { TABLE_NAME_PREFIX } from "../config";
import { TableService } from "./models";

export interface DBUser {
  id: string;
  email: string;
  username: string;
  short_bio: string;
  encrypted_password?: string;
}

export class UsersTableService extends TableService {
  public static readonly tableName = `${TABLE_NAME_PREFIX}_users`;
  public readonly tableName = UsersTableService.tableName;

  constructor(public datastorePool: Pool) {
    super();
  }

  public async setup(): Promise<void> {
    const queryString = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        short_bio VARCHAR(64),
        encrypted_password VARCHAR(64) NOT NULL
      )
      ;
    `;

    await this.datastorePool.query(queryString);
  }

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
    const queryString = `
        INSERT INTO ${UsersTableService.tableName}(
            id,
            email,
            username,
            encrypted_password
        )
        VALUES (
            '${userId}',
            '${email}',
            '${username}',
            '${encryptedPassword}'
        )
        ;
        `;

    await this.datastorePool.query(queryString);
  }

  public async selectUserByUsername({
    username,
  }: {
    username: string;
  }): Promise<DBUser | undefined> {
    const queryString = `
        SELECT
          *
        FROM
          ${UsersTableService.tableName}
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
          ${UsersTableService.tableName}
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
}
