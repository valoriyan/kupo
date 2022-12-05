import sharp from "sharp";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { BackendKupoFile } from "../../../controllers/models";

export async function uploadMediaFile({
  controller,
  file,
  blobStorageService,
}: {
  controller: Controller;
  file: BackendKupoFile;
  blobStorageService: BlobStorageServiceInterface;
}): Promise<
  InternalServiceResponse<
    ErrorReasonTypes<string>,
    {
      blobFileKey: string;
      fileTemporaryUrl: string;
      mimetype: string;
    }
  >
> {
  const { mimetype } = file;

  const permittedImageTypes = ["image/jpeg", "image/png", "image/gif"];

  const permittedVideoTypes = ["video/mp4"];

  const permittedMimeTypes = [...permittedImageTypes, ...permittedVideoTypes];

  if (!permittedMimeTypes.includes(mimetype)) {
    throw new Error(`Cannot handle file of type ${mimetype}`);
  }

  if (permittedImageTypes.includes(mimetype)) {
    // TODO: ADD IMAGE VALIDATION
  } else if (permittedVideoTypes.includes(mimetype)) {
    // TODO: ADD VIDEO VALIDATION
  }

  let buffer = file.buffer;
  const ogBufferSizeInKB = file.buffer.byteLength / 1024;

  // Image compression
  if (permittedImageTypes.includes(mimetype) && ogBufferSizeInKB > 256) {
    if (mimetype.includes("png")) {
      buffer = await sharp(file.buffer)
        .rotate()
        .resize({ fit: sharp.fit.contain, width: 1000, withoutEnlargement: true })
        .png({ compressionLevel: 8 })
        .toBuffer();
    } else if (mimetype.includes("jpeg")) {
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

  const saveImageResponse = await blobStorageService.saveImage({
    controller,
    image: buffer,
  });
  if (saveImageResponse.type === EitherType.failure) {
    return saveImageResponse;
  }
  const { success: blobItemPointer } = saveImageResponse;

  const getTemporaryImageUrlResponse = await blobStorageService.getTemporaryImageUrl({
    controller,
    blobItemPointer,
  });
  if (getTemporaryImageUrlResponse.type === EitherType.failure) {
    return getTemporaryImageUrlResponse;
  }
  const { success: fileTemporaryUrl } = getTemporaryImageUrlResponse;

  return Success({
    blobFileKey: blobItemPointer.fileKey,
    fileTemporaryUrl,
    mimetype,
  });
}
