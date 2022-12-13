import { Server } from "socket.io";
import { RenderableAcceptedPublishingChannelSubmissionNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfAcceptedPublishingChannelSubmission({
  io,
  renderableAcceptedPublishingChannelSubmissionNotification,
  userId,
}: {
  io: Server;
  renderableAcceptedPublishingChannelSubmissionNotification: RenderableAcceptedPublishingChannelSubmissionNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.ACCEPTED_PUBLISHING_CHANNEL_SUBMISSION,
    renderableAcceptedPublishingChannelSubmissionNotification,
  );
}
