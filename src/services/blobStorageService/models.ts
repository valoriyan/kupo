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
