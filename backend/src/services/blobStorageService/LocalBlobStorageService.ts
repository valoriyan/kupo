/* eslint-disable @typescript-eslint/ban-types */
import { writeFileSync, unlinkSync, mkdirSync } from "fs";
import { getEnvironmentVariable } from "../../utilities";
import { Promise as BluebirdPromise } from "bluebird";
import { BlobStorageServiceInterface, BlobItemPointer } from "./models";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { Controller } from "tsoa";
import { GenericResponseFailedReason } from "../../controllers/models";
import { generateBlobFileKeyForMimeType } from "./utilities";

export class LocalBlobStorageService extends BlobStorageServiceInterface {
  static localBlobStorageDirectory: string = getEnvironmentVariable(
    "LOCAL_BLOB_STORAGE_DIRECTORY",
  );

  constructor() {
    super();
  }

  async saveFile({
    controller,
    image,
    mimeType,
  }: {
    controller: Controller;
    image: Buffer;
    mimeType: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, BlobItemPointer>> {
    try {
      const fileKey = generateBlobFileKeyForMimeType({ mimeType });
      const fileWritePath =
        LocalBlobStorageService.localBlobStorageDirectory + "/" + fileKey;
      console.log(`Writing file to ${fileWritePath}`);

      await mkdirSync(LocalBlobStorageService.localBlobStorageDirectory, {
        recursive: true,
      });

      await writeFileSync(fileWritePath, image, "base64");

      return Success({
        fileKey,
      });
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.BLOB_STORAGE_ERROR,
        error,
        additionalErrorInformation: "Error at saveImage",
      });
    }
  }

  async getTemporaryImageUrl({
    controller,
    blobItemPointer,
  }: {
    controller: Controller;
    blobItemPointer: BlobItemPointer;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, string>> {
    try {
      const fileReadPath =
        "http://localhost:4000/" +
        LocalBlobStorageService.localBlobStorageDirectory +
        "/" +
        blobItemPointer.fileKey;

      return Success(fileReadPath);
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.BLOB_STORAGE_ERROR,
        error,
        additionalErrorInformation: "Error at getTemporaryImageUrl",
      });
    }
  }

  async deleteImages({
    controller,
    blobPointers,
  }: {
    controller: Controller;
    blobPointers: BlobItemPointer[];
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
    try {
      await BluebirdPromise.map(blobPointers, async (blobPointer) => {
        const filePath =
          LocalBlobStorageService.localBlobStorageDirectory + "/" + blobPointer.fileKey;
        await unlinkSync(filePath);
      });

      return Success({});
    } catch (error) {
      return Failure({
        controller,
        httpStatusCode: 500,
        reason: GenericResponseFailedReason.BLOB_STORAGE_ERROR,
        error,
        additionalErrorInformation: "Error at deleteImages",
      });
    }
  }
}
