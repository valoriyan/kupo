import sharp from "sharp";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { BlobStorageService } from "../../../services/blobStorageService";

export async function uploadMediaFile({
  controller,
  file,
  mimeType,
  blobStorageService,
}: {
  controller: Controller;
  file: Express.Multer.File;
  mimeType: string;
  blobStorageService: BlobStorageService;
}): Promise<
  InternalServiceResponse<
    ErrorReasonTypes<string>,
    { blobFileKey: string; fileTemporaryUrl: string }
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  let buffer = file.buffer;
  const ogBufferSizeInKB = file.buffer.byteLength / 1024;

  //////////////////////////////////////////////////
  // Compress Image
  //////////////////////////////////////////////////

  // Image compression
  if (ogBufferSizeInKB > 256) {
    if (mimeType === "image/png") {
      buffer = await sharp(file.buffer)
        .rotate()
        .resize({ fit: sharp.fit.contain, width: 1000, withoutEnlargement: true })
        .png({ compressionLevel: 8 })
        .toBuffer();
    } else if (mimeType === "image/jpeg") {
      buffer = await sharp(file.buffer)
        .rotate()
        .resize({ fit: sharp.fit.contain, width: 1000, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
    }
  }

  const newBufferSizeInKB = buffer.byteLength / 1024;

  // Revert to original file if compression somehow made the file larger (it could happen...)
  buffer = newBufferSizeInKB < ogBufferSizeInKB ? buffer : file.buffer;

  //////////////////////////////////////////////////
  // Upload File
  //////////////////////////////////////////////////

  const saveImageResponse = await blobStorageService.saveFile({
    controller,
    image: buffer,
    mimeType,
  });
  if (saveImageResponse.type === EitherType.failure) {
    return saveImageResponse;
  }
  const { success: blobItemPointer } = saveImageResponse;

  //////////////////////////////////////////////////
  // Get File Url
  //////////////////////////////////////////////////

  const getTemporaryImageUrlResponse = await blobStorageService.getTemporaryImageUrl({
    controller,
    blobItemPointer,
  });
  if (getTemporaryImageUrlResponse.type === EitherType.failure) {
    return getTemporaryImageUrlResponse;
  }
  const { success: fileTemporaryUrl } = getTemporaryImageUrlResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    blobFileKey: blobItemPointer.fileKey,
    fileTemporaryUrl,
  });
}
