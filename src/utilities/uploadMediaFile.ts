import { BlobStorageService } from "../services/blobStorageService";

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
  if (!["image/jpeg", "image/png"].includes(mimetype)) {
    throw new Error(`Cannot handle file of type ${mimetype}`);
  }

  // TODO: ADD IMAGE VALIDATION
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
