import Link from "next/link";
import Router from "next/router";
import { ContentElement, RenderablePostShared } from "#/api";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { Avatar } from "../Avatar";
import { Flex } from "../Layout";
import { Body } from "../Typography";
import { ActionMenu, MenuAction } from "./ActionMenu";
import { ContentViewer } from "./ContentViewer";
import { SharedPost } from "./SharedPost";

export interface PostBodyProps {
  authorUserName: string | undefined;
  authorUserAvatar: string | undefined;
  relativeTimestamp: string;
  caption: string;
  contentElements: ContentElement[];
  setCurrentMediaUrl?: (url: string | undefined) => void;
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
          py: "$3",
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
            Router.push(getProfilePageUrl({ username: props.authorUserName }));
          }}
        />
        <Link href={getProfilePageUrl({ username: props.authorUserName || "" })} passHref>
          <a>{props.authorUserName ? `@${props.authorUserName}` : "User"}</a>
        </Link>
        <Flex css={{ marginLeft: "auto", gap: "$5", alignItems: "center" }}>
          <Timestamp>{props.relativeTimestamp}</Timestamp>
          {props.menuActions && <ActionMenu actions={props.menuActions} />}
        </Flex>
      </Flex>
      <Body css={{ px: "$4", py: "$2", mb: "$3" }}>{props.caption}</Body>
      {props.shared && props.shared.type === "post" ? (
        <SharedPost
          post={props.shared.post}
          setCurrentMediaUrl={props.setCurrentMediaUrl}
        />
      ) : (
        !!props.contentElements?.length && (
          <ContentViewer
            contentElements={props.contentElements}
            setCurrentMediaUrl={props.setCurrentMediaUrl}
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
