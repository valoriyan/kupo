import { Pool, QueryResult } from "pg";

export class DatastoreService {
    static hasBeenInitialized = false;
    static datastorePool: undefined | Pool;

    static get(): Pool {
        return this.datastorePool ?? new Pool();
    }
}

export const getDB = async (): Promise<void> => {
    const pool: Pool = new Pool();

    const databaseName = "playhouseDev";


    await initializeTestDatabase({pool, databaseName});
    // await tearDownTestDatabase({pool, databaseName});
};

export const createUser = async (): Promise<void> => {
    return;
};

export const initializeTestDatabase = async ({pool, databaseName}: {pool: Pool, databaseName: string},
): Promise<void> => {


    const response: QueryResult<{datname: string}> = await pool.query(`
        SELECT datname FROM pg_database
        WHERE datistemplate = false;    
    `);

    const databaseExists: boolean = response.rows.every((row: {datname: string}): boolean => {
        return row.datname !== databaseName;
    });


    if (!databaseExists) {
        await pool.query(`
            CREATE DATABASE ${databaseName};
        `);
    }

    return;
};


export const tearDownTestDatabase = async ({pool, databaseName}: {pool: Pool, databaseName: string},
    ): Promise<void> => {
        await pool.query(`
            DROP DATABASE IF EXISTS ${databaseName};
        `);


        return;
    };
    