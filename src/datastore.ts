import { Pool, QueryResult } from "pg";



export const getDB = async (): Promise<void> => {
    const pool: Pool = new Pool();

    const databaseName = "playhouseDev";


    await initializeData({pool, databaseName});
    await tearDownData({pool, databaseName});
};

const initializeData = async ({pool, databaseName}: {pool: Pool, databaseName: string},
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


const tearDownData = async ({pool, databaseName}: {pool: Pool, databaseName: string},
    ): Promise<void> => {
        await pool.query(`
            DROP DATABASE IF EXISTS ${databaseName};
        `);


        return;
    };
    