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
  static bucketLocation: string;

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

      const bucketLocation = await new Promise(
        (resolve: (location: string) => void, reject) => {
          WasabiBlobStorageService.connection.getBucketLocation((error, data) => {
            console.log("getBucketLocation", data);
            if (error) return reject(error);
            if (!data.LocationConstraint)
              return reject("Failed to lookup bucket location.");
            resolve(data.LocationConstraint);
          });
        },
      );
      if (!bucketLocation) {
        throw new Error("Failed to lookup bucket location.");
      }
      WasabiBlobStorageService.bucketLocation = bucketLocation;
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
    // TODO: REPLACE WITH CDN

    if (!!WasabiBlobStorageService.bucketLocation) {
      const bucketLocation = WasabiBlobStorageService.bucketLocation;
      const bucketName = WasabiBlobStorageService.bucket;
      const fileName = blobItemPointer.fileKey;

      return `https://s3.${bucketLocation}.wasabisys.com/${bucketName}/${fileName}`;
    } else {
      throw new Error("Missing bucket location");
    }

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
