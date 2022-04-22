import { BlobStorageServiceInterface } from "./../../services/blobStorageService/models";
import { DatabaseService } from "../../services/databaseService";
import {
  ContentElement,
  RenderablePost,
  SharedPostType,
  UnrenderablePost,
  UnrenderablePostWithoutElementsOrHashtags,
} from "./models";
import { Promise as BluebirdPromise } from "bluebird";

export async function constructRenderablePostsFromParts({
  blobStorageService,
  databaseService,
  posts,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  posts: UnrenderablePostWithoutElementsOrHashtags[];
  clientUserId: string | undefined;
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
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePostWithoutElementsOrHashtags: UnrenderablePostWithoutElementsOrHashtags;
  clientUserId: string | undefined;
}): Promise<RenderablePost> {
  const { sharedPostId } = unrenderablePostWithoutElementsOrHashtags;

  const unrenderableSharedPostWithoutElementsOrHashtags = !!sharedPostId
    ? await databaseService.tableNameToServicesMap.postsTableService.getPostByPostId({
        postId: sharedPostId,
      })
    : undefined;

  const sharedPost = !!unrenderableSharedPostWithoutElementsOrHashtags
    ? await assemblePostComponents({
        blobStorageService,
        databaseService,
        unrenderablePostWithoutElementsOrHashtags:
          unrenderableSharedPostWithoutElementsOrHashtags,
        clientUserId,
      })
    : undefined;

  const post = await assemblePostComponents({
    blobStorageService,
    databaseService,
    unrenderablePostWithoutElementsOrHashtags,
    clientUserId,
  });

  const shared = !!sharedPost
    ? {
        type: SharedPostType.post,
        post: sharedPost,
      }
    : undefined;

  return {
    ...post,
    shared,
  };
}

async function assemblePostComponents({
  blobStorageService,
  databaseService,
  unrenderablePostWithoutElementsOrHashtags,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePostWithoutElementsOrHashtags: UnrenderablePostWithoutElementsOrHashtags;
  clientUserId: string | undefined;
}): Promise<UnrenderablePost> {
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

  const contentElements: ContentElement[] = await BluebirdPromise.map(
    filedPostContentElements,
    async (filedPostContentElement): Promise<ContentElement> => {
      const fileTemporaryUrl = await blobStorageService.getTemporaryImageUrl({
        blobItemPointer: {
          fileKey: filedPostContentElement.blobFileKey,
        },
      });

      return {
        temporaryUrl: fileTemporaryUrl,
        mimeType: filedPostContentElement.mimeType,
      };
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

  const countOfCommentsOnPost =
    await databaseService.tableNameToServicesMap.postCommentsTableService.countCommentsOnPostId(
      {
        postId,
      },
    );

  const isLikedByClient =
    !!clientUserId &&
    (await databaseService.tableNameToServicesMap.postLikesTableService.doesUserIdLikePostId(
      {
        userId: clientUserId,
        postId,
      },
    ));

  const isSavedByClient =
    !!clientUserId &&
    (await databaseService.tableNameToServicesMap.savedItemsTableService.doesUserIdSaveItemId(
      {
        userId: clientUserId,
        itemId: postId,
      },
    ));

  return {
    postId,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    contentElements,
    hashtags,
    likes: {
      count: countOfLikesOnPost,
    },
    comments: {
      count: countOfCommentsOnPost,
    },
    isLikedByClient,
    isSavedByClient,
  };
}

export function mergeArraysOfUnrenderablePostWithoutElementsOrHashtags({
  arrays,
}: {
  arrays: UnrenderablePostWithoutElementsOrHashtags[][];
}) {
  const mergedArray: UnrenderablePostWithoutElementsOrHashtags[] = [];
  const setOfIncludedPostIds = new Set();

  arrays.forEach((array) => {
    array.forEach((element) => {
      const { postId } = element;
      if (!setOfIncludedPostIds.has(postId)) {
        setOfIncludedPostIds.add(postId);
        mergedArray.push(element);
      }
    });
  });

  return mergedArray;
}
