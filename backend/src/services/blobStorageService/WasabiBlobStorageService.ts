/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from "uuid";
import { getEnvironmentVariable } from "../../utilities";
import { Promise as BluebirdPromise } from "bluebird";
import { BlobStorageServiceInterface, BlobItemPointer } from "./models";
import { Endpoint, S3 } from "aws-sdk";
import { PutObjectRequest, ManagedUpload, DeleteObjectRequest } from "aws-sdk/clients/s3";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { GenericResponseFailedReason } from "../../controllers/models";
import { Controller } from "tsoa";

export class WasabiBlobStorageService extends BlobStorageServiceInterface {
  static connection: S3;
  static bucket: string = getEnvironmentVariable("WASABI_BUCKET");
  static accessKey: string = getEnvironmentVariable("WASABI_ACCESS_KEY");
  static secretKey: string = getEnvironmentVariable("WASABI_SECRET_ACCESS_KEY");
  static bucketLocation: string = getEnvironmentVariable("WASABI_BUCKET_REGION");

  constructor() {
    super();
  }

  static async get(): Promise<S3> {
    if (!WasabiBlobStorageService.connection) {
      WasabiBlobStorageService.connection = new S3({
        endpoint: new Endpoint("s3.wasabisys.com"),
        accessKeyId: WasabiBlobStorageService.accessKey,
        secretAccessKey: WasabiBlobStorageService.secretKey,
      });
    }

    return this.connection;
  }

  async saveImage({
    controller,
    image,
  }: {
    image: Buffer;
    controller: Controller;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, BlobItemPointer>> {
    try {
      const fileKey = uuidv4();

      const putObjectRequest: PutObjectRequest = {
        Bucket: WasabiBlobStorageService.bucket,
        Key: fileKey,
        Body: image,
        ACL: "public-read",
      };

      const uploadOptions: ManagedUpload.ManagedUploadOptions = {
        partSize: 10 * 1024 * 1024,
        queueSize: 10,
      };

      const { Key } = await WasabiBlobStorageService.connection
        .upload(putObjectRequest, uploadOptions)
        .promise();

      return Success({
        fileKey: Key,
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
    // TODO: REPLACE WITH CDN

    try {
      const bucketLocation = WasabiBlobStorageService.bucketLocation;
      const bucketName = WasabiBlobStorageService.bucket;
      const fileName = blobItemPointer.fileKey;

      return Success(
        `https://s3.${bucketLocation}.wasabisys.com/${bucketName}/${fileName}`,
      );

      // const temporaryImageUrlDurationSeconds = 60;

      // const temporaryUrl: string = WasabiBlobStorageService.connection.getSignedUrl(
      //   "getObject",
      //   {
      //     Bucket: WasabiBlobStorageService.bucket,
      //     Key: blobItemPointer.fileKey,
      //     Expires: temporaryImageUrlDurationSeconds,
      //   },
      // );

      // return temporaryUrl;
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
        const deleteObjectRequest: DeleteObjectRequest = {
          Bucket: WasabiBlobStorageService.bucket,
          Key: blobPointer.fileKey,
        };

        await WasabiBlobStorageService.connection
          .deleteObject(deleteObjectRequest)
          .promise();
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
