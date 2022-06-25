import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { constructRenderablePostCommentFromParts } from "../../postComment/utilities";
import { DBUserNotification } from "../../../services/databaseService/tableServices/userNotificationsTableService";
import { constructRenderablePostFromParts } from "../../publishedItem/post/utilities";
import { constructRenderableUserFromParts } from "../../user/utilities";
import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";
import { RenderableNewTagInPublishedItemCommentNotification } from "../models/renderableUserNotifications";

export async function assembleRenderableNewTagInPublishedItemCommentNotification({
  userNotification,
  blobStorageService,
  databaseService,
  clientUserId,
}: {
  userNotification: DBUserNotification;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  clientUserId: string;
}): Promise<RenderableNewTagInPublishedItemCommentNotification> {
    const {
        reference_table_id: publishedItemCommentId,
        timestamp_seen_by_user: timestampSeenByUser,
    } = userNotification;

    const countOfUnreadNotifications =
        await databaseService.tableNameToServicesMap.userNotificationsTableService.selectCountOfUnreadUserNotificationsByUserId(
            { userId: clientUserId },
        );


    const unrenderablePublishedItemComment =
        await databaseService.tableNameToServicesMap.postCommentsTableService.getPostCommentById(
            { postCommentId: publishedItemCommentId },
    );

    const publishedItemComment = await constructRenderablePostCommentFromParts({
        blobStorageService,
        databaseService,
        unrenderablePostComment: unrenderablePublishedItemComment,
        clientUserId,
    });

    const unrenderableUserTaggingClient =
        await databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId({
            userId: unrenderablePublishedItemComment.authorUserId,
        });

    
    const userTaggingClient = await constructRenderableUserFromParts({
        clientUserId,
        unrenderableUser: unrenderableUserTaggingClient!,
        blobStorageService,
        databaseService,
      });
    
    const unrenderablePostWithoutElementsOrHashtags =
        await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
            {
                id: publishedItemComment.postId,
            },
        );
  
      
    const publishedItem = await constructRenderablePostFromParts({
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem: unrenderablePostWithoutElementsOrHashtags,
        clientUserId,
    });
        

    return {
        type: NOTIFICATION_EVENTS.NEW_TAG_IN_PUBLISHED_ITEM_COMMENT,
        countOfUnreadNotifications,
        eventTimestamp: publishedItemComment.creationTimestamp,
        timestampSeenByUser,
        userTaggingClient,
        publishedItem,
        publishedItemComment,
      };
}
