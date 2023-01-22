import {
  MediaElement,
  PublishedItemHost,
  PublishedItemType,
  RootPurchasedShopItemDetails,
  RootRenderablePost,
  RootShopItemPreview,
} from "#/api";
import { styled } from "#/styling";
import { goToUserProfilePage } from "#/templates/UserProfile";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { CommunityName } from "../CommunityName";
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
  purchasedMediaElements: MediaElement[] | undefined;
  mediaElements: MediaElement[];
  setCurrentMediaElement?: (elem: MediaElement | undefined) => void;
  sharedItem?: RootRenderablePost | RootShopItemPreview | RootPurchasedShopItemDetails;
  host: PublishedItemHost;
  menuActions?: MenuAction[];
  onPostClick?: () => void;
  contentHeight?: string;
}

export const PostBody = (props: PostBodyProps) => {
  const mediaElements = props.mediaElements;
  const isPurchased = !!props.purchasedMediaElements;

  return (
    <>
      <Flex
        css={{
          px: "$4",
          pt: "$4",
          pb: "$3",
          gap: "$3",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: props.onPostClick ? "pointer" : "default",
        }}
        onClick={props.onPostClick}
      >
        <Flex css={{ gap: "$3", alignItems: "center", flex: 1 }}>
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
          <Flex css={{ gap: "$2", alignItems: "baseline", flexWrap: "wrap" }}>
            <UserName username={props.authorUserName} />
            {typeof props.host !== "string" && (
              <>
                <Subtext css={{ color: "$secondaryText" }}>in</Subtext>
                <CommunityName name={props.host.name} />
              </>
            )}
          </Flex>
        </Flex>
        <Flex css={{ gap: "$5", alignItems: "center" }}>
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
        !!mediaElements?.length && (
          <ContentViewer
            mediaElements={mediaElements}
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
            {isPurchased ? (
              <Body css={{ color: "$secondaryText", fontStyle: "italic" }}>
                Purchased
              </Body>
            ) : (
              <Body>${props.price}</Body>
            )}
          </Flex>
          <Button>{isPurchased ? "View Content" : "Purchase"}</Button>
        </ShopItemDetailsWrapper>
      )}
    </>
  );
};

const Timestamp = styled("div", {
  color: "$secondaryText",
  textAlign: "right",
});

const ShopItemDetailsWrapper = styled(Stack, {
  m: "$4",
  bg: "$background3",
  borderRadius: "$3",
  px: "$5",
  py: "$4",
  gap: "$4",
});
