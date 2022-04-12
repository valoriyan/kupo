import sharp from "sharp";
import { BlobStorageServiceInterface } from "../../services/blobStorageService/models";

export async function uploadMediaFile({
  file,
  blobStorageService,
}: {
  file: Express.Multer.File;
  blobStorageService: BlobStorageServiceInterface;
}): Promise<{
  blobFileKey: string;
  fileTemporaryUrl: string;
  mimetype: string;
}> {
  const mimetype = file.mimetype;

  const permittedImageTypes = ["image/jpeg", "image/png"];

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
  if (permittedImageTypes.includes(mimetype) && ogBufferSizeInKB > 512) {
    if (mimetype.includes("png")) {
      buffer = await sharp(file.buffer)
        .resize({ fit: sharp.fit.contain, width: 1000, withoutEnlargement: true })
        .png({ compressionLevel: 8 })
        .toBuffer();
    } else {
      buffer = await sharp(file.buffer)
        .resize({ fit: sharp.fit.contain, width: 1000, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
    }
  }

  const newBufferSizeInKB = buffer.byteLength / 1024;

  // Revert to original file if compression somehow made the file larger (it could happen...)
  buffer = newBufferSizeInKB < ogBufferSizeInKB ? buffer : file.buffer;

  const blobItemPointer = await blobStorageService.saveImage({ image: buffer });

  const fileTemporaryUrl = await blobStorageService.getTemporaryImageUrl({
    blobItemPointer,
  });

  return {
    blobFileKey: blobItemPointer.fileKey,
    fileTemporaryUrl,
    mimetype,
  };
}
