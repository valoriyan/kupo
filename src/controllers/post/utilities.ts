import { LocalBlobStorageService } from "src/services/blobStorageService";
import { DatabaseService } from "src/services/databaseService";
import { RenderablePost, UnrenderablePostWithoutElementsOrHashtags } from "./models";
import { Promise as BluebirdPromise } from "bluebird";

export async function constructRenderablePostsFromParts({
  blobStorageService,
  databaseService,
  posts,
}: {
  blobStorageService: LocalBlobStorageService;
  databaseService: DatabaseService;
  posts: UnrenderablePostWithoutElementsOrHashtags[];
}): Promise<RenderablePost[]> {
  const renderablePosts = await BluebirdPromise.map(
    posts,
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
  const {
    postId,
    postAuthorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = unrenderablePostWithoutElementsOrHashtags;

  const filedPostContentElements =
    await databaseService.tableNameToServicesMap.postContentElementsTableService.getPostContentElementsByPostId(
      {
        postId: postId,
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

  const hashtags =
    await databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsForPostId(
      { postId },
    );

  return {
    postId,
    postAuthorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    contentElementTemporaryUrls,
    hashtags,
  };
}
