/* eslint-disable @typescript-eslint/ban-types */
import { getEnvironmentVariable } from "../../utilities";
import { Promise as BluebirdPromise } from "bluebird";
import { BlobStorageServiceInterface, BlobItemPointer } from "./models";
import { Endpoint, S3 } from "aws-sdk";
import {
  PutObjectRequest,
  ManagedUpload,
  DeleteObjectRequest,
  ObjectList,
} from "aws-sdk/clients/s3";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { GenericResponseFailedReason } from "../../controllers/models";
import { Controller } from "tsoa";
import { generateBlobFileKeyForMimeType } from "./utilities";

//////////////////////////////////////////////////
// Documentation
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
//////////////////////////////////////////////////
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

  async saveFile({
    controller,
    fileBuffer,
    mimeType,
  }: {
    fileBuffer: Buffer;
    controller: Controller;
    mimeType: string;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, BlobItemPointer>> {
    try {
      const fileKey = generateBlobFileKeyForMimeType({ mimeType });

      const putObjectRequest: PutObjectRequest = {
        Bucket: WasabiBlobStorageService.bucket,
        Key: fileKey,
        Body: fileBuffer,
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

  async listAllBlobsKeys(): Promise<string[]> {
    const requestParams = {
      Bucket: WasabiBlobStorageService.bucket /* required */,
    };

    const request = WasabiBlobStorageService.connection.listObjects(requestParams);

    const blobs: ObjectList = await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let collectedContents: ObjectList = [];

      request.eachPage((err, data) => {
        if (err) {
          reject(err);
          return false;
        }

        if (!data) {
          resolve(collectedContents);
          return true;
        }
        const contents: ObjectList = data.Contents!;
        collectedContents = collectedContents.concat(contents);
        return true;
      });
    });

    const keys = blobs.map((blob) => blob.Key);
    return keys as string[];
  }
}
