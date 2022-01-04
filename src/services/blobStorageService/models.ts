export interface BlobItemPointer {
  fileKey: string;
}

export enum BlobStorageServiceType {
  WASABI = "WASABI",
  LOCAL = "LOCAL",
}

export abstract class BlobStorageServiceInterface {
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
