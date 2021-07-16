import { Pool, QueryResult } from "pg";



export const getDB = async (): Promise<void> => {
    const pool: Pool = new Pool();

    await initializeDatabase({pool});
};

const initializeDatabase = async ({pool}: {pool: Pool},
): Promise<void> => {

    const databaseName: string = "playhouse-dev";

    const response: QueryResult = await pool.query(`
        SELECT datname FROM pg_database
        WHERE datistemplate = false;    
    `);

    console.log("response", response.rows);


    return;
};