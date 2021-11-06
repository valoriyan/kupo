import { v4 as uuidv4 } from "uuid";
import { singleton } from "tsyringe";

import { writeFileSync, unlinkSync, mkdirSync } from "fs";
import { getEnvironmentVariable } from "../../utilities";
import { Promise as BluebirdPromise } from "bluebird";

export interface BlobItemPointer {
  fileKey: string;
}

export abstract class BlobStorageService {
  abstract saveImage({ image }: { image: Buffer }): Promise<BlobItemPointer>;

  abstract getTemporaryImageUrl({
    blobItemPointer,
  }: {
    blobItemPointer: BlobItemPointer;
  }): Promise<string>;

  abstract deleteImages({
    blobPointers,
  }: {
    blobPointers: BlobItemPointer[];
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
    console.log(`Writing file to ${fileWritePath}`);

    await mkdirSync(this.localBlobStorageDirectory, { recursive: true });
    await writeFileSync(fileWritePath, image);

    return {
      fileKey,
    };
  }

  async getTemporaryImageUrl({
    blobItemPointer,
  }: {
    blobItemPointer: BlobItemPointer;
  }): Promise<string> {
    const fileWritePath = this.localBlobStorageDirectory + "/" + blobItemPointer.fileKey;
    return fileWritePath;
  }

  async deleteImages({
    blobPointers,
  }: {
    blobPointers: BlobItemPointer[];
  }): Promise<void> {
    await BluebirdPromise.map(blobPointers, async (blobPointer) => {
      const filePath = this.localBlobStorageDirectory + "/" + blobPointer.fileKey;
      await unlinkSync(filePath);
    });

    return;
  }
}
