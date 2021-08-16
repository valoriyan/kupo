import { v4 as uuidv4 } from "uuid";
import { singleton } from "tsyringe";

import { appendFileSync, unlinkSync } from "fs";
import { getEnvironmentVariable } from "../../utilities";

export interface BlobItemPointer {
  fileKey: string;
}

export abstract class BlobStorageService {
  abstract saveImage({ image }: { image: Buffer }): Promise<BlobItemPointer>;

  abstract deleteImage({
    blobImagePointer,
  }: {
    blobImagePointer: BlobItemPointer;
  }): Promise<void>;
}

@singleton()
export class LocalBlobStorageService extends BlobStorageService {
  private localBlobStorageDirectory: string = getEnvironmentVariable(
    "LOCAL_BLOB_STORAGE_DIRECTORY",
  );

  constructor() {
    super();
  }

  async saveImage({ image }: { image: Buffer }): Promise<BlobItemPointer> {
    const fileKey = uuidv4();
    const fileWritePath = this.localBlobStorageDirectory + "/" + fileKey;

    await appendFileSync(fileWritePath, image);
    return {
      fileKey,
    };
  }

  async deleteImage({
    blobImagePointer,
  }: {
    blobImagePointer: BlobItemPointer;
  }): Promise<void> {
    const filePath = this.localBlobStorageDirectory + "/" + blobImagePointer.fileKey;
    await unlinkSync(filePath);
    return;
  }
}
