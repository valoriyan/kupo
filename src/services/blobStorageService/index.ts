import { v4 as uuidv4 } from "uuid";


import { appendFileSync, unlinkSync } from "fs";

export interface BlobItemPointer {
    fileKey: string;
}

export interface BlobStorageService {
    image: {
        save: ({
            image,
        }: {
            image: Buffer,
        }) => Promise<BlobItemPointer>;
    
        delete: (
            {
                blobImagePointer,
            }: {
                blobImagePointer: BlobItemPointer,
            }
        ) => Promise<void>;
    }
}

export async function generateLocalBlobStorageService({
    localBlobStorageDirectory,
}: {
    localBlobStorageDirectory: string;
}): Promise<BlobStorageService> {
    
    async function saveImage({
        image,
    }: {
        image: Buffer,
    }): Promise<BlobItemPointer> {
        const fileKey = uuidv4();
        const fileWritePath = localBlobStorageDirectory + "/" + fileKey;

        await appendFileSync(fileWritePath, image);
        return {
            fileKey,
        };
    }

    async function deleteImage(
        {
            blobImagePointer,
        }: {
            blobImagePointer: BlobItemPointer,
    }): Promise<void> {
        const filePath = localBlobStorageDirectory + "/" + blobImagePointer.fileKey;
        await unlinkSync(filePath)
        return;
    }

    return {
        image: {
            save: saveImage,
            delete: deleteImage,
        },
    };
}