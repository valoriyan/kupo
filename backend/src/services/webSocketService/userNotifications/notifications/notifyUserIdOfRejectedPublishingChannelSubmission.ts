import { Server } from "socket.io";
import { RenderableRejectedPublishingChannelSubmissionNotification } from "../../../../controllers/notification/models/renderableUserNotifications";
import { NOTIFICATION_EVENTS } from "../../eventsConfig";
import { generatePrivateUserWebSocketRoomName } from "../../utilities";

export async function notifyUserIdOfRejectedPublishingChannelSubmission({
  io,
  renderableRejectedPublishingChannelSubmissionNotification,
  userId,
}: {
  io: Server;
  renderableRejectedPublishingChannelSubmissionNotification: RenderableRejectedPublishingChannelSubmissionNotification;
  userId: string;
}): Promise<void> {
  const roomName = generatePrivateUserWebSocketRoomName({ userId });

  io.to([roomName]).emit(
    NOTIFICATION_EVENTS.REJECTED_PUBLISHING_CHANNEL_SUBMISSION,
    renderableRejectedPublishingChannelSubmissionNotification,
  );
}
