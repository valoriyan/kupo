import { DatabaseService } from "src/services/databaseService";
import { BaseRenderablePublishedItem, UncompiledBasePublishedItem } from "./models";

export async function assembleBaseRenderablePublishedItem({
  databaseService,
  uncompiledBasePublishedItem,
  clientUserId,
}: {
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<BaseRenderablePublishedItem> {
  const {
    type,
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = uncompiledBasePublishedItem;

  const hashtags =
    await databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsForPublishedItemId(
      { publishedItemId: id },
    );

  const countOfLikesOnPost =
    await databaseService.tableNameToServicesMap.publishedItemLikesTableService.countLikesOnPublishedItemId(
      {
        publishedItemId: id,
      },
    );

  const countOfCommentsOnPost =
    await databaseService.tableNameToServicesMap.postCommentsTableService.countCommentsOnPostId(
      {
        postId: id,
      },
    );

  const isLikedByClient =
    !!clientUserId &&
    (await databaseService.tableNameToServicesMap.publishedItemLikesTableService.doesUserIdLikePublishedItemId(
      {
        userId: clientUserId,
        publishedItemId: id,
      },
    ));

  const isSavedByClient =
    !!clientUserId &&
    (await databaseService.tableNameToServicesMap.savedItemsTableService.doesUserIdSavePublishedItemId(
      {
        userId: clientUserId,
        publishedItemId: id,
      },
    ));

  const baseRenderablePublishedItem: BaseRenderablePublishedItem = {
    type,
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
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

  return baseRenderablePublishedItem;
}
