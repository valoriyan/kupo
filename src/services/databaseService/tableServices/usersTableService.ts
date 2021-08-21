import { Pool, QueryResult } from "pg";
import { DATABASE_TABLE_NAMES } from "../config";

export class UsersTableService {
  constructor(private datastorePool: Pool) {}

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
        INSERT INTO ${DATABASE_TABLE_NAMES.users}(
            id,
            email,
            username,
            encryptedpassword
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

  public async selectUserByUsername({ username }: { username: string }): Promise<
    | {
        id: string;
        email: string;
        username: string;
        encryptedpassword: string;
      }
    | undefined
  > {
    const queryString = `
        SELECT
          *
        FROM
          ${DATABASE_TABLE_NAMES.users}
        WHERE
          username = '${username}'
        LIMIT
          1
        ;
      `;

    const response: QueryResult<{
      id: string;
      email: string;
      username: string;
      encryptedpassword: string;
    }> = await this.datastorePool.query(queryString);

    const rows = response.rows;

    return rows[0];
  }

  public async selectUserByUserId({ userId }: { userId: string }): Promise<
    | {
        id: string;
        email: string;
        username: string;
      }
    | undefined
  > {
    const queryString = `
        SELECT
          *
        FROM
          ${DATABASE_TABLE_NAMES.users}
        WHERE
          id = '${userId}'
        LIMIT
          1
        ;
      `;

    const response: QueryResult<{
      id: string;
      email: string;
      username: string;
    }> = await this.datastorePool.query(queryString);

    const rows = response.rows;

    return rows[0];
  }
}
