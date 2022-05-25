import { MediaElement, RenderablePostShared } from "#/api";
import { styled } from "#/styling";
import { goToUserProfilePage } from "#/templates/UserProfile";
import { Avatar } from "../Avatar";
import { Flex } from "../Layout";
import { Body } from "../Typography";
import { UserName } from "../UserName";
import { ActionMenu, MenuAction } from "./ActionMenu";
import { ContentViewer } from "./ContentViewer";
import { SharedPost } from "./SharedPost";

export interface PostBodyProps {
  authorUserName: string | undefined;
  authorUserAvatar: string | undefined;
  relativeTimestamp: string;
  caption: string;
  mediaElements: MediaElement[];
  setCurrentMediaElement?: (elem: MediaElement | undefined) => void;
  shared?: RenderablePostShared;
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
      <Body css={{ px: "$4", py: "$2", mb: "$3" }}>{props.caption}</Body>
      {props.shared && props.shared.type === "post" ? (
        <SharedPost
          post={props.shared.post}
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
    </>
  );
};

const Timestamp = styled("div", {
  color: "$secondaryText",
});
