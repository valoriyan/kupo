import { Pool } from "pg";
import { DATABASE_NAME, DATABASE_TABLE_NAMES } from "./config";

export async function setupTables(): Promise<void> {
  const temporaryPool = new Pool({
    database: DATABASE_NAME,
  });
  await temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE_NAMES.users} (
        id VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        encryptedpassword VARCHAR(64) NOT NULL
      )
      ;
    `);

  await temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE_NAMES.posts} (
        image_id VARCHAR(64) UNIQUE NOT NULL,
        caption VARCHAR(256) NOT NULL,
        image_blob_filekey VARCHAR(128) NOT NULL,
        title VARCHAR(128) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        scheduled_publication_timestamp BIGINT NOT NULL
      )
      ;
    `);

  await temporaryPool.query(`
      CREATE TABLE IF NOT EXISTS ${DATABASE_TABLE_NAMES.userFollows} (
        user_id_doing_following VARCHAR(64) NOT NULL,
        user_id_being_followed VARCHAR(64) NOT NULL,
        PRIMARY KEY (user_id_doing_following, user_id_being_followed)
      )
      ;
    `);

  await temporaryPool.end();
}
