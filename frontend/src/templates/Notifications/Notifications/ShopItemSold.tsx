import { RenderableShopItemSoldNotification } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Stack } from "#/components/Layout";
import { PostThumbnail } from "#/components/PostThumbnail";
import { Body } from "#/components/Typography";
import { UserName } from "#/components/UserName";
import { goToUserProfilePage } from "#/templates/UserProfile";
import { getShortRelativeTimestamp } from "#/utils/getRelativeTimestamp";
import { NotificationWrapper } from "../shared";

export interface ShopItemSoldProps {
  notification: RenderableShopItemSoldNotification;
}

export const ShopItemSold = ({ notification }: ShopItemSoldProps) => {
  const { purchaser, shopItem, eventTimestamp } = notification;

  return (
    <NotificationWrapper>
      <Avatar
        alt={`@${purchaser.username}'s profile picture`}
        src={purchaser.profilePictureTemporaryUrl}
        size="$8"
        onClick={() => goToUserProfilePage(purchaser.username)}
      />

      <Stack css={{ gap: "$2" }}>
        <Body>
          <UserName username={purchaser.username} /> purchased your shop item.
        </Body>
        <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
          {getShortRelativeTimestamp(eventTimestamp)} ago
        </Body>
      </Stack>

      <PostThumbnail post={shopItem} />
    </NotificationWrapper>
  );
};
