import { Pool, QueryResult } from "pg";
import { singleton } from "tsyringe";

@singleton()
export class DatabaseService {
  static databaseName = process.env.DATABASE_NAME;
  
  static tableNamePrefix = "playhouse";
  static userTableName = `${DatabaseService.tableNamePrefix}_users`;
  static postsTableName = `${DatabaseService.tableNamePrefix}_posts`;

  static datastorePool: Pool;

  static async doesDatabaseExist(): Promise<boolean> {
    const temporaryPool = new Pool();

    const response: QueryResult<{ datname: string }> = await temporaryPool.query(`
      SELECT datname FROM pg_database
      WHERE datistemplate = false;
    `);

    const databaseExists: boolean = response.rows.some(
      (row: { datname: string }): boolean => {
        return row.datname === DatabaseService.databaseName;
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
        CREATE DATABASE ${DatabaseService.databaseName};
      `);
    }
    await temporaryPool.end();
  }

  static async setupTables(): Promise<void> {

    const temporaryPool = new Pool({
      database: DatabaseService.databaseName,
    });
    await temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${DatabaseService.userTableName} (
        id VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        encryptedpassword VARCHAR(64) NOT NULL
      );
    `);

    await temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${DatabaseService.postsTableName} (
        image_id VARCHAR(64) UNIQUE NOT NULL,
        caption VARCHAR(256) NOT NULL,
        image_blob_filekey VARCHAR(128) NOT NULL,
        title VARCHAR(128) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL
      );
    `);

    await temporaryPool.end();

  }

  static async teardownDatabase(): Promise<void> {
    const temporaryPool = new Pool();

    const queryString = `
      DROP DATABASE IF EXISTS ${DatabaseService.databaseName} WITH (FORCE);
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
      DROP TABLE IF EXISTS ${DatabaseService.userTableName};
    `;

    await temporaryPool.query(queryString);

    await temporaryPool.end();
  }

  static async get(): Promise<Pool> {
    if (!DatabaseService.datastorePool) {
      DatabaseService.datastorePool = new Pool({
        database: DatabaseService.databaseName,
      });
    }

    return this.datastorePool;
  }
}
