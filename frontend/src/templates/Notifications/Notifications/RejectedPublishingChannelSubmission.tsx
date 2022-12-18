import { RenderableRejectedPublishingChannelSubmissionNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { CommunityName } from "#/components/CommunityName";
import { Stack } from "#/components/Layout";
import { PostThumbnail } from "#/components/PostThumbnail";
import { Body } from "#/components/Typography";
import { goToCommunityPage } from "#/templates/CommunityPage";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { NotificationWrapper } from "../shared";

export interface RejectedPublishingChannelSubmissionProps {
  notification: RenderableRejectedPublishingChannelSubmissionNotification;
}

export const RejectedPublishingChannelSubmission = ({
  notification,
}: RejectedPublishingChannelSubmissionProps) => {
  const { publishingChannel, publishedItem, rejectionSummary, eventTimestamp } =
    notification;

  return (
    <NotificationWrapper>
      <Avatar
        alt={`+${publishingChannel.name}'s profile picture`}
        src={publishingChannel.profilePictureTemporaryUrl}
        size="$8"
        onClick={() => goToCommunityPage(publishingChannel.name)}
      />

      <Stack css={{ gap: "$2" }}>
        <Body>
          <CommunityName name={publishingChannel.name} /> rejected your submission for
          violating the following community rule:{" "}
          <em>
            &ldquo;
            {rejectionSummary.rejectionReason}
            &rdquo;
          </em>
        </Body>
        <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
          {getShortRelativeTimestamp(eventTimestamp)} ago
        </Body>
      </Stack>

      <PostThumbnail post={publishedItem} />
    </NotificationWrapper>
  );
};
