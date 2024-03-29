import { Pool } from "pg";

export abstract class TableService {
  abstract tableName: string;
  abstract datastorePool: Pool;

  abstract dependencies: string[];

  abstract setup(): Promise<void>;

  async teardown(): Promise<void> {
    console.log(`Dropping table ${this.tableName}`);

    const queryString = `
            DROP TABLE IF EXISTS ${this.tableName};
        `;
    await this.datastorePool.query(queryString);
  }
}
