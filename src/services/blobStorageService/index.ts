import { v4 as uuidv4 } from "uuid";
import { singleton } from "tsyringe";

import { appendFileSync, unlinkSync } from "fs";

export interface BlobItemPointer {
  fileKey: string;
}

abstract class BlobStorageService {
  abstract saveImage({ image }: { image: Buffer }): Promise<BlobItemPointer>;

  abstract deleteImage({
    blobImagePointer,
  }: {
    blobImagePointer: BlobItemPointer;
  }): Promise<void>;
}

@singleton()
export class LocalBlobStorageService extends BlobStorageService {
  constructor(private localBlobStorageDirectory: string) {
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
