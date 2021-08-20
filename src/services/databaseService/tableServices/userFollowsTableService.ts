import { Pool, QueryResult } from "pg";
import { DATABASE_TABLE_NAMES } from "../config";

export class UserFollowsTableService {
  constructor(private datastorePool: Pool) {}

  public async createUserFollow({
    userIdDoingFollowing,
    userIdBeingFollowed,
  }: {
    userIdDoingFollowing: string;
    userIdBeingFollowed: string;
  }): Promise<void> {
    const queryString = `
        INSERT INTO ${DATABASE_TABLE_NAMES.userFollows}(
            user_id_doing_following,
            user_id_being_followed,
        )
        VALUES (
            '${userIdDoingFollowing}',
            '${userIdBeingFollowed}'
        )
        ;
        `;

    await this.datastorePool.query(queryString);
  }

  public async countFollowersOfUserId({
    userIdBeingFollowed,
  }: {
    userIdBeingFollowed: string;
  }): Promise<number> {
    const queryString = `
        SELECT
          COUNT(*)
        FROM
          ${DATABASE_TABLE_NAMES.userFollows}
        WHERE
          user_id_doing_following = '${userIdBeingFollowed}'
        ;
      `;

    const response: QueryResult<{
      id: string;
      email: string;
      username: string;
      encryptedpassword: string;
    }> = await this.datastorePool.query(queryString);

    console.log(response);
    return 0;
  }
}
