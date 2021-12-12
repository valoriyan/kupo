import { BlobStorageService } from "../../services/blobStorageService/models";

export async function uploadMediaFile({
  file,
  blobStorageService,
}: {
  file: Express.Multer.File;
  blobStorageService: BlobStorageService;
}): Promise<{
  blobFileKey: string;
  fileTemporaryUrl: string;
  mimetype: string;
}> {
  const mimetype = file.mimetype;

  const permittedImageTypes = ["image/jpeg", "image/png", "image/heic", "image/heif"];

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

  const blobItemPointer = await blobStorageService.saveImage({
    image: file.buffer,
  });

  const fileTemporaryUrl = await blobStorageService.getTemporaryImageUrl({
    blobItemPointer,
  });

  return {
    blobFileKey: blobItemPointer.fileKey,
    fileTemporaryUrl,
    mimetype,
  };
}
