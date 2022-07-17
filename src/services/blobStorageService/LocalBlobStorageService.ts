import { v4 as uuidv4 } from "uuid";
import { writeFileSync, unlinkSync, mkdirSync } from "fs";
import { getEnvironmentVariable } from "../../utilities";
import { Promise as BluebirdPromise } from "bluebird";
import { BlobStorageServiceInterface, BlobItemPointer } from "./models";

export class LocalBlobStorageService extends BlobStorageServiceInterface {
  static localBlobStorageDirectory: string = getEnvironmentVariable(
    "LOCAL_BLOB_STORAGE_DIRECTORY",
  );

  constructor() {
    super();
  }

  async saveImage({ image }: { image: Buffer }): Promise<BlobItemPointer> {
    const fileKey = uuidv4();
    const fileWritePath =
      LocalBlobStorageService.localBlobStorageDirectory + "/" + fileKey;
    console.log(`Writing file to ${fileWritePath}`);

    await mkdirSync(LocalBlobStorageService.localBlobStorageDirectory, {
      recursive: true,
    });
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
    const fileReadPath =
      "http://localhost:4000/" +
      LocalBlobStorageService.localBlobStorageDirectory +
      "/" +
      blobItemPointer.fileKey;
    return fileReadPath;
  }

  async deleteImages({
    blobPointers,
  }: {
    blobPointers: BlobItemPointer[];
  }): Promise<void> {
    await BluebirdPromise.map(blobPointers, async (blobPointer) => {
      const filePath =
        LocalBlobStorageService.localBlobStorageDirectory + "/" + blobPointer.fileKey;
      await unlinkSync(filePath);
    });

    return;
  }
}
