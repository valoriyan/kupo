import { Pool, QueryResult } from "pg";

export class DatabaseService {
  static databaseName = process.env.DATABASE_NAME;
  static tableName = "playhousedevtable";

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

  static async setupTable(): Promise<void> {
    const temporaryPool = new Pool({
      database: DatabaseService.databaseName,
    });
    await temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${DatabaseService.tableName} (
        id VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        encryptedpassword VARCHAR(64) NOT NULL
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

  static async teardownTable(): Promise<void> {
    const databaseExists = await DatabaseService.doesDatabaseExist();
    if (!databaseExists) return;

    const temporaryPool = new Pool();

    const queryString = `
      DROP TABLE IF EXISTS ${DatabaseService.tableName};
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
