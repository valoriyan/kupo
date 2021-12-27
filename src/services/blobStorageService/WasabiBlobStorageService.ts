import { v4 as uuidv4 } from "uuid";
import { getEnvironmentVariable } from "../../utilities";
import { Promise as BluebirdPromise } from "bluebird";
import { BlobStorageServiceInterface, BlobItemPointer } from "./models";
import { Endpoint, S3 } from "aws-sdk";
import { PutObjectRequest, ManagedUpload, DeleteObjectRequest } from "aws-sdk/clients/s3";

export class WasabiBlobStorageService extends BlobStorageServiceInterface {
  static connection: S3;
  static bucket: string = getEnvironmentVariable("WASABI_BUCKET");
  static accessKey: string = getEnvironmentVariable("WASABI_ACCESS_KEY");
  static secretKey: string = getEnvironmentVariable("WASABI_SECRET_ACCESS_KEY");

  constructor() {
    super();
  }

  static async start(): Promise<void> {
    WasabiBlobStorageService.get();
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

  async saveImage({ image }: { image: Buffer }): Promise<BlobItemPointer> {
    const fileKey = uuidv4();

    const putObjectRequest: PutObjectRequest = {
      Bucket: WasabiBlobStorageService.bucket,
      Key: fileKey,
      Body: image,
    };

    const uploadOptions: ManagedUpload.ManagedUploadOptions = {
      partSize: 10 * 1024 * 1024,
      queueSize: 10,
    };

    const { Key } = await WasabiBlobStorageService.connection
      .upload(putObjectRequest, uploadOptions)
      .promise();

    return {
      fileKey: Key,
    };
  }

  async getTemporaryImageUrl({
    blobItemPointer,
  }: {
    blobItemPointer: BlobItemPointer;
  }): Promise<string> {
    const temporaryImageUrlDurationSeconds = 60;

    const temporaryUrl: string = WasabiBlobStorageService.connection.getSignedUrl(
      "getObject",
      {
        Bucket: WasabiBlobStorageService.bucket,
        Key: blobItemPointer.fileKey,
        Expires: temporaryImageUrlDurationSeconds,
      },
    );

    return temporaryUrl;
  }

  async deleteImages({
    blobPointers,
  }: {
    blobPointers: BlobItemPointer[];
  }): Promise<void> {
    await BluebirdPromise.map(blobPointers, async (blobPointer) => {
      const deleteObjectRequest: DeleteObjectRequest = {
        Bucket: WasabiBlobStorageService.bucket,
        Key: blobPointer.fileKey,
      };

      await WasabiBlobStorageService.connection
        .deleteObject(deleteObjectRequest)
        .promise();
    });

    return;
  }
}
