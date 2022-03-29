import { useState } from "react";
import { ContentElement, RenderablePost } from "#/api";
import { styled } from "#/styling";
import { copyTextToClipboard } from "#/utils/copyTextToClipboard";
import { getSinglePostUrl } from "#/utils/generateLinkUrls";
import { CloseIcon, LinkIcon, UserIcon } from "../Icons";
import { SoftwareDownloadIcon } from "../Icons/generated/SoftwareDownloadIcon";
import { Stack } from "../Layout";
import { Heading } from "../Typography";
import { openSharePostModal } from "./SharePostModal";

export interface ShareMenuProps {
  hide: () => void;
  post: RenderablePost;
  currentContentElement: ContentElement | undefined;
}

export const ShareMenu = ({ hide, post, currentContentElement }: ShareMenuProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const shareToProfile = () => {
    hide();
    openSharePostModal({ post });
  };

  const copyLink = () => {
    const link = `${location.origin}${getSinglePostUrl(post.postId)}`;
    copyTextToClipboard(link, "Link");
  };

  const saveMedia = async () => {
    if (!currentContentElement) return;
    setIsLoading(true);
    const blob = await (await fetch(currentContentElement.temporaryUrl)).blob();
    const blobUrl = URL.createObjectURL(blob);
    const dlAnchor = document.createElement("a");
    dlAnchor.style.display = "none";
    // TODO: support different file types and move to util function
    dlAnchor.download = "kupono-media.jpg";
    dlAnchor.href = blobUrl;
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
    URL.revokeObjectURL(blobUrl);
    setIsLoading(false);
  };

  return (
    <Stack css={{ bg: "$background1", width: "100%" }}>
      <ItemWrapper onClick={hide}>
        <CloseIcon />
        <Heading>Exit</Heading>
      </ItemWrapper>
      <ItemWrapper onClick={shareToProfile}>
        <UserIcon />
        <Heading>Share to Profile</Heading>
      </ItemWrapper>
      <ItemWrapper onClick={copyLink}>
        <LinkIcon />
        <Heading>Copy Link</Heading>
      </ItemWrapper>
      {!!currentContentElement && (
        <ItemWrapper onClick={saveMedia} disabled={isLoading}>
          <SoftwareDownloadIcon />
          <Heading>Save Media</Heading>
        </ItemWrapper>
      )}
    </Stack>
  );
};

const ItemWrapper = styled("button", {
  display: "flex",
  gap: "$6",
  py: "$6",
  px: "$7",
  alignItems: "center",
  "&:not(:last-child)": {
    borderBottom: "solid $borderWidths$1 $border",
  },
});
