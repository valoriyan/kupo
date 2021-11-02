import { LocalBlobStorageService } from "src/services/blobStorageService";
import { DatabaseService } from "src/services/databaseService";
import { RenderablePost, UnrenderablePostWithoutElementsOrHashtags } from "./models";
import { Promise as BluebirdPromise } from "bluebird";

export async function constructRenderablePostsFromParts({
  blobStorageService,
  databaseService,
  unrenderablePostsWithoutElementsOrHashtags,
}: {
  blobStorageService: LocalBlobStorageService;
  databaseService: DatabaseService;
  unrenderablePostsWithoutElementsOrHashtags: UnrenderablePostWithoutElementsOrHashtags[];
}): Promise<RenderablePost[]> {
  const renderablePosts = await BluebirdPromise.map(
    unrenderablePostsWithoutElementsOrHashtags,
    async (unrenderablePostWithoutElementsOrHashtags) =>
      await constructRenderablePostFromParts({
        blobStorageService,
        databaseService,
        unrenderablePostWithoutElementsOrHashtags,
      }),
  );

  return renderablePosts;
}

export async function constructRenderablePostFromParts({
  blobStorageService,
  databaseService,
  unrenderablePostWithoutElementsOrHashtags,
}: {
  blobStorageService: LocalBlobStorageService;
  databaseService: DatabaseService;
  unrenderablePostWithoutElementsOrHashtags: UnrenderablePostWithoutElementsOrHashtags;
}): Promise<RenderablePost> {
  const filedPostContentElements =
    await databaseService.tableNameToServicesMap.postContentElementsTableService.getPostContentElementsByPostId(
      {
        postId: unrenderablePostWithoutElementsOrHashtags.postId,
      },
    );

  const contentElementTemporaryUrls: string[] = await BluebirdPromise.map(
    filedPostContentElements,
    async (filedPostContentElement): Promise<string> => {
      const fileTemporaryUrl = await blobStorageService.getTemporaryImageUrl({
        blobItemPointer: {
          fileKey: filedPostContentElement.blobFileKey,
        },
      });

      return fileTemporaryUrl;
    },
  );

  return {
    ...unrenderablePostWithoutElementsOrHashtags,
    contentElementTemporaryUrls,
    hashtags: [],
  };
}
