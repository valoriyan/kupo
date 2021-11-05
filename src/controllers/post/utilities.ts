import { LocalBlobStorageService } from "src/services/blobStorageService";
import { DatabaseService } from "src/services/databaseService";
import {
  RenderablePost,
  UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags,
} from "./models";
import { Promise as BluebirdPromise } from "bluebird";
import { getJSDateFromTimestamp } from "src/utilities";

export async function constructRenderablePostsFromParts({
  blobStorageService,
  databaseService,
  posts,
  userTimeZone,
}: {
  blobStorageService: LocalBlobStorageService;
  databaseService: DatabaseService;
  posts: UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags[];
  userTimeZone: string;
}): Promise<RenderablePost[]> {
  const renderablePosts = await BluebirdPromise.map(
    posts,
    async (unrenderablePostWithoutRenderableDatesTimesElementsOrHashtags) =>
      await constructRenderablePostFromParts({
        blobStorageService,
        databaseService,
        unrenderablePostWithoutRenderableDatesTimesElementsOrHashtags,
        userTimeZone,
      }),
  );

  return renderablePosts;
}

export async function constructRenderablePostFromParts({
  blobStorageService,
  databaseService,
  unrenderablePostWithoutRenderableDatesTimesElementsOrHashtags,
  userTimeZone,
}: {
  blobStorageService: LocalBlobStorageService;
  databaseService: DatabaseService;
  unrenderablePostWithoutRenderableDatesTimesElementsOrHashtags: UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags;
  userTimeZone: string;
}): Promise<RenderablePost> {
  const {
    postId,
    postAuthorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = unrenderablePostWithoutRenderableDatesTimesElementsOrHashtags;

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
      {
        postId,
      },
    );

  const scheduledPublicationDateTime = getJSDateFromTimestamp({
    timestamp: scheduledPublicationTimestamp,
    timezone: userTimeZone,
  });

  const expirationDateTime = expirationTimestamp
    ? getJSDateFromTimestamp({ timestamp: expirationTimestamp, timezone: userTimeZone })
    : undefined;

  return {
    postId,
    postAuthorUserId,
    caption,

    scheduledPublicationDateTime,
    expirationDateTime,
    contentElementTemporaryUrls,
    hashtags,
  };
}
