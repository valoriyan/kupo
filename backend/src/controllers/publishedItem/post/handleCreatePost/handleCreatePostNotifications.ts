import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../../utilities/monads/unwrapListOfResponses";
import { Promise as BluebirdPromise } from "bluebird";
import { RenderablePublishedItem } from "../../models";
import { Controller } from "tsoa";
import { collectTagsFromText } from "../../../utilities/collectTagsFromText";
import { DatabaseService } from "../../../../services/databaseService";
import { BlobStorageService } from "../../../../services/blobStorageService";
import { WebSocketService } from "../../../../services/webSocketService";
import { assembleRecordAndSendNewTagInPublishedItemCaptionNotification } from "../../../notification/notificationSenders/assembleRecordAndSendNewTagInPublishedItemCaptionNotification";

export async function handleCreatePostNotifications({
  controller,
  renderablePublishedItem,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  renderablePublishedItem: RenderablePublishedItem;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
  // eslint-disable-next-line @typescript-eslint/ban-types
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Get Usernames Tagged in Caption
  //////////////////////////////////////////////////
  const { caption, authorUserId } = renderablePublishedItem;

  const tags = collectTagsFromText({ text: caption });

  //////////////////////////////////////////////////
  // Get User Ids Associated with Tagged Usernames
  //////////////////////////////////////////////////

  const selectUsersByUsernamesResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      { controller, usernames: tags },
    );
  if (selectUsersByUsernamesResponse.type === EitherType.failure) {
    return selectUsersByUsernamesResponse;
  }
  const { success: foundUnrenderableUsersMatchingTags } = selectUsersByUsernamesResponse;

  const foundUserIdsMatchingTags = foundUnrenderableUsersMatchingTags
    .map(({ userId }) => userId)
    .filter((userId) => userId !== authorUserId);

  //////////////////////////////////////////////////
  // Send Tagged Caption Notifications to Everyone Tagged
  //////////////////////////////////////////////////
  const assembleRecordAndSendNewTagInPublishedItemCaptionNotificationResponses =
    await BluebirdPromise.map(
      foundUserIdsMatchingTags,
      async (taggedUserId) =>
        await assembleRecordAndSendNewTagInPublishedItemCaptionNotification({
          controller,
          publishedItemId: renderablePublishedItem.id,
          recipientUserId: taggedUserId,
          databaseService,
          blobStorageService,
          webSocketService,
        }),
    );

  const mappedResponse = unwrapListOfEitherResponses({
    eitherResponses:
      assembleRecordAndSendNewTagInPublishedItemCaptionNotificationResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (mappedResponse.type === EitherType.failure) {
    return mappedResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////
  return Success({});
}
