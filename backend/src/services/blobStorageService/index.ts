import { singleton } from "tsyringe";
import { getEnvironmentVariable } from "../../utilities";
import { LocalBlobStorageService } from "./LocalBlobStorageService";
import { BlobStorageServiceInterface, BlobStorageServiceType } from "./models";
import { WasabiBlobStorageService } from "./WasabiBlobStorageService";

@singleton()
export class BlobStorageService extends BlobStorageServiceInterface {
  static implementation: BlobStorageServiceInterface =
    BlobStorageService.selectBlobStorageServiceImplementation();

  constructor() {
    super();
  }

  saveImage = BlobStorageService.implementation.saveImage;
  getTemporaryImageUrl = BlobStorageService.implementation.getTemporaryImageUrl;
  deleteImages = BlobStorageService.implementation.deleteImages;

  static selectBlobStorageServiceImplementation(): BlobStorageServiceInterface {
    const implementedBlobStorageServiceType: string = getEnvironmentVariable(
      "IMPLEMENTED_BLOB_STORAGE_SERVICE_TYPE",
    );

    if (implementedBlobStorageServiceType === BlobStorageServiceType.LOCAL) {
      return new LocalBlobStorageService();
    } else if (implementedBlobStorageServiceType === BlobStorageServiceType.WASABI) {
      WasabiBlobStorageService.get();
      return new WasabiBlobStorageService();
    } else {
      throw new Error(
        `Failed to initialize blob storage of type "${implementedBlobStorageServiceType}"`,
      );
    }
  }
}
