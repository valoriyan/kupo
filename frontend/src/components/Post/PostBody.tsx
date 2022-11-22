import {
  MediaElement,
  PublishedItemType,
  RootPurchasedShopItemDetails,
  RootRenderablePost,
  RootShopItemPreview,
} from "#/api";
import { styled } from "#/styling";
import { goToUserProfilePage } from "#/templates/UserProfile";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { ImageIcon } from "../Icons";
import { Flex, Stack } from "../Layout";
import { Body, Subtext } from "../Typography";
import { UserName } from "../UserName";
import { WithTags } from "../WithTags";
import { ActionMenu, MenuAction } from "./ActionMenu";
import { ContentViewer } from "./ContentViewer";
import { SharedPost } from "./SharedPost";

export interface PostBodyProps {
  type: PublishedItemType;
  authorUserName: string | undefined;
  authorUserAvatar: string | undefined;
  relativeTimestamp: string;
  caption: string;
  title: string | undefined;
  price: number | undefined;
  purchasedMediaElementsMetadata: { count: number } | undefined;
  mediaElements: MediaElement[];
  setCurrentMediaElement?: (elem: MediaElement | undefined) => void;
  sharedItem?: RootRenderablePost | RootShopItemPreview | RootPurchasedShopItemDetails;
  menuActions?: MenuAction[];
  onPostClick?: () => void;
  contentHeight?: string;
}

export const PostBody = (props: PostBodyProps) => {
  return (
    <>
      <Flex
        css={{
          px: "$4",
          pt: "$4",
          pb: "$3",
          gap: "$3",
          alignItems: "center",
          cursor: props.onPostClick ? "pointer" : "default",
        }}
        onClick={props.onPostClick}
      >
        <Avatar
          alt={`@${props.authorUserName ?? "User"}'s profile picture`}
          src={props.authorUserAvatar}
          size="$7"
          onClick={(e) => {
            if (!props.authorUserName) return;
            e.stopPropagation();
            goToUserProfilePage(props.authorUserName);
          }}
        />
        <UserName username={props.authorUserName} />
        <Flex css={{ marginLeft: "auto", gap: "$5", alignItems: "center" }}>
          <Timestamp>{props.relativeTimestamp}</Timestamp>
          {props.menuActions && <ActionMenu actions={props.menuActions} />}
        </Flex>
      </Flex>
      <Body css={{ px: "$4", py: "$2", mb: "$3" }}>
        <WithTags text={props.caption} />
      </Body>
      {props.sharedItem ? (
        <SharedPost
          post={props.sharedItem}
          setCurrentMediaElement={props.setCurrentMediaElement}
        />
      ) : (
        !!props.mediaElements?.length && (
          <ContentViewer
            mediaElements={props.mediaElements}
            setCurrentMediaElement={props.setCurrentMediaElement}
            contentHeight={props.contentHeight}
          />
        )
      )}
      {props.type === PublishedItemType.ShopItem && (
        <ShopItemDetailsWrapper>
          <Flex
            css={{ justifyContent: "space-between", alignItems: "center", gap: "$4" }}
          >
            <Flex css={{ alignItems: "center", gap: "$4" }}>
              <Body>{props.title}</Body>
              <Flex css={{ alignItems: "center", gap: "$3", color: "$primary" }}>
                <ImageIcon height={16} width={16} style={{ marginBottom: 1 }} />
                <Subtext>{props.purchasedMediaElementsMetadata?.count}</Subtext>
              </Flex>
            </Flex>
            <Body>${props.price}</Body>
          </Flex>
          <Button>Purchase</Button>
        </ShopItemDetailsWrapper>
      )}
    </>
  );
};

const Timestamp = styled("div", {
  color: "$secondaryText",
});

const ShopItemDetailsWrapper = styled(Stack, {
  m: "$4",
  bg: "$background3",
  borderRadius: "$3",
  px: "$5",
  py: "$4",
  gap: "$4",
});
