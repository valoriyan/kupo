import { Pool, QueryResult } from "pg";
import { singleton } from "tsyringe";
import { DATABASE_NAME, DATABASE_TABLE_NAMES } from "./config";
import { setupTables } from "./setupTables";
import { PostsTableService } from "./tableServices/postsTableService";
import { UserFollowsTableService } from "./tableServices/userFollowsTableService";
import { UsersTableService } from "./tableServices/usersTableService";

@singleton()
export class DatabaseService {
  static datastorePool: Pool;

  public usersTableService: UsersTableService = new UsersTableService(
    DatabaseService.datastorePool,
  );
  public postsTableService: PostsTableService = new PostsTableService(
    DatabaseService.datastorePool,
  );
  public userFollowsTableService: UserFollowsTableService = new UserFollowsTableService(
    DatabaseService.datastorePool,
  );

  static async start(): Promise<void> {
    console.log("STARTING DATABASE SERVICE");
    DatabaseService.datastorePool = new Pool({
      database: DATABASE_NAME,
    });
  }

  static async doesDatabaseExist(): Promise<boolean> {
    const temporaryPool = new Pool();

    const response: QueryResult<{ datname: string }> = await temporaryPool.query(`
      SELECT datname FROM pg_database
      WHERE datistemplate = false;
    `);

    const databaseExists: boolean = response.rows.some(
      (row: { datname: string }): boolean => {
        return row.datname === DATABASE_NAME;
      },
    );
    await temporaryPool.end();

    return databaseExists;
  }

  static async setupDatabase(): Promise<void> {
    const databaseExists = await DatabaseService.doesDatabaseExist();

    const temporaryPool = new Pool();

    if (!databaseExists) {
      await temporaryPool.query(`
        CREATE DATABASE ${DATABASE_NAME};
      `);
    }
    await temporaryPool.end();
  }

  static async setupTables(): Promise<void> {
    await setupTables();
  }

  static async teardownDatabase(): Promise<void> {
    const temporaryPool = new Pool();

    const queryString = `
      DROP DATABASE IF EXISTS ${DATABASE_NAME} WITH (FORCE);
    `;

    try {
      await temporaryPool.query(queryString);
    } catch (error) {
      console.log(error);
    }

    await temporaryPool.end();
  }

  static async teardownTables(): Promise<void> {
    const databaseExists = await DatabaseService.doesDatabaseExist();
    if (!databaseExists) return;

    const temporaryPool = new Pool();

    const queryString = `
      DROP TABLE IF EXISTS ${DATABASE_TABLE_NAMES.users};
    `;

    await temporaryPool.query(queryString);

    await temporaryPool.end();
  }

  static async get(): Promise<Pool> {
    if (!DatabaseService.datastorePool) {
      DatabaseService.datastorePool = new Pool({
        database: DATABASE_NAME,
      });
    }

    return this.datastorePool;
  }
}

DatabaseService.get();
