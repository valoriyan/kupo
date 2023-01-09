import { v4 as uuidv4 } from "uuid";

export function generateBlobFileKeyForMimeType({ mimeType }: { mimeType: string }) {
  const fileKey = uuidv4();

  if (mimeType == "image/jpeg") {
    return `${fileKey}.jpeg`;
  } else if (mimeType == "image/png") {
    return `${fileKey}.png`;
  } else if (mimeType == "image/gif") {
    return `${fileKey}.gif`;
  } else if (mimeType == "video/mp4") {
    return `${fileKey}.mp4`;
  } else {
    throw new Error("Unsupported mime type at generateBlobFileKeyForMimeType");
  }
}
