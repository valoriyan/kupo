/* eslint-disable @typescript-eslint/ban-types */
import { Controller } from "tsoa";
import { ErrorReasonTypes, InternalServiceResponse } from "../../utilities/monads";

export interface BlobItemPointer {
  fileKey: string;
}

export enum BlobStorageServiceType {
  WASABI = "WASABI",
  LOCAL = "LOCAL",
}

export abstract class BlobStorageServiceInterface {
  abstract saveFile({
    controller,
    fileBuffer,
    mimeType,
  }: {
    controller: Controller;
    fileBuffer: Buffer;
    mimeType: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, BlobItemPointer>>;

  abstract getTemporaryImageUrl({
    controller,
    blobItemPointer,
  }: {
    controller: Controller;
    blobItemPointer: BlobItemPointer;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string>>;

  abstract deleteImages({
    controller,
    blobPointers,
  }: {
    controller: Controller;
    blobPointers: BlobItemPointer[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>>;
}
