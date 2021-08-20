import { Pool } from "pg";
import { DATABASE_TABLE_NAMES } from "../config";

export class PostsTableService {
  constructor(private datastorePool: Pool) {}

  public async createPost({
    imageId,
    caption,
    imageBlobFilekey,
    title,
    price,
    scheduledPublicationTimestamp,
  }: {
    imageId: string;
    caption: string;
    imageBlobFilekey: string;
    title: string;
    price: number;
    scheduledPublicationTimestamp: number;
  }): Promise<void> {
    const queryString = `
        INSERT INTO ${DATABASE_TABLE_NAMES.posts}(
            image_id,
            caption,
            image_blob_filekey,
            title,
            price,
            scheduled_publication_timestamp
        )
        VALUES (
            '${imageId}',
            '${caption}',
            '${imageBlobFilekey}',
            '${title}',
            '${price}',
            '${scheduledPublicationTimestamp}'
        )
        ;
        `;

    await this.datastorePool.query(queryString);
  }
}
