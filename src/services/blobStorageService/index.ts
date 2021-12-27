import { singleton } from "tsyringe";
import { getEnvironmentVariable } from "../../utilities";
import { LocalBlobStorageService } from "./LocalBlobStorageService";
import { BlobStorageServiceInterface, BlobStorageType } from "./models";
import { WasabiBlobStorageService } from "./WasabiBlobStorageService";

@singleton()
export class BlobStorageService extends BlobStorageServiceInterface {
  static blobStorageType: string = getEnvironmentVariable("BLOB_STORAGE_TYPE");

  static blobStorageService: BlobStorageServiceInterface =
    BlobStorageService.selectBlobStorageService();

  constructor() {
    super();
  }

  saveImage = BlobStorageService.blobStorageService.saveImage;
  getTemporaryImageUrl = BlobStorageService.blobStorageService.getTemporaryImageUrl;
  deleteImages = BlobStorageService.blobStorageService.deleteImages;

  static selectBlobStorageService(): BlobStorageServiceInterface {
    const blobStorageType: string = getEnvironmentVariable("BLOB_STORAGE_TYPE");

    if (blobStorageType === BlobStorageType.LOCAL) {
      return new LocalBlobStorageService();
    } else if (blobStorageType === BlobStorageType.WASABI) {
      WasabiBlobStorageService.get();
      return new WasabiBlobStorageService();
    } else {
      throw new Error(`Failed to initialize blob storage of type "${blobStorageType}"`);
    }
  }
}
