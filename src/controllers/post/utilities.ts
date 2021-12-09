import { LocalBlobStorageService } from "src/services/blobStorageService";
import { DatabaseService } from "src/services/databaseService";
import { RenderablePost, UnrenderablePostWithoutElementsOrHashtags } from "./models";
import { Promise as BluebirdPromise } from "bluebird";

export async function constructRenderablePostsFromParts({
  blobStorageService,
  databaseService,
  posts,
  clientUserId,
}: {
  blobStorageService: LocalBlobStorageService;
  databaseService: DatabaseService;
  posts: UnrenderablePostWithoutElementsOrHashtags[];
  clientUserId: string;
}): Promise<RenderablePost[]> {
  const renderablePosts = await BluebirdPromise.map(
    posts,
    async (unrenderablePostWithoutElementsOrHashtags) =>
      await constructRenderablePostFromParts({
        blobStorageService,
        databaseService,
        unrenderablePostWithoutElementsOrHashtags,
        clientUserId,
      }),
  );

  return renderablePosts;
}

export async function constructRenderablePostFromParts({
  blobStorageService,
  databaseService,
  unrenderablePostWithoutElementsOrHashtags,
  clientUserId,
}: {
  blobStorageService: LocalBlobStorageService;
  databaseService: DatabaseService;
  unrenderablePostWithoutElementsOrHashtags: UnrenderablePostWithoutElementsOrHashtags;
  clientUserId: string;
}): Promise<RenderablePost> {
  const {
    postId,
    creationTimestamp,
    authorUserId,
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

  const countOfLikesOnPost =
    await databaseService.tableNameToServicesMap.postLikesTableService.countLikesOnPostId(
      {
        postId,
      },
    );

  const isLikedByClient =
    await databaseService.tableNameToServicesMap.postLikesTableService.doesUserIdLikePostId(
      {
        userId: clientUserId,
        postId,
      },
    );

  return {
    postId,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    contentElementTemporaryUrls,
    hashtags,
    likes: {
      count: countOfLikesOnPost,
    },
    isLikedByClient,
  };
}
