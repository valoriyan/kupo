import { useState } from "react";
import { useSharePost } from "#/api/mutations/posts/sharePost";
import { styled } from "#/styling";
import { copyTextToClipboard } from "#/utils/copyTextToClipboard";
import { getSinglePostUrl } from "#/utils/generateLinkUrls";
import { CloseIcon, LinkIcon, UserIcon } from "../Icons";
import { SoftwareDownloadIcon } from "../Icons/generated/SoftwareDownloadIcon";
import { Stack } from "../Layout";
import { Heading } from "../Typography";

export interface ShareMenuProps {
  hide: () => void;
  postId: string;
  currentMediaUrl: string | undefined;
}

export const ShareMenu = ({ hide, postId, currentMediaUrl }: ShareMenuProps) => {
  const { mutateAsync: sharePost } = useSharePost({ postId });
  const [isLoading, setIsLoading] = useState(false);

  const shareToProfile = async () => {
    sharePost({
      caption: "I want to share this!",
      hashtags: ["shared"],
    });
    hide();
  };

  const copyLink = () => {
    const link = `${location.origin}${getSinglePostUrl(postId)}`;
    copyTextToClipboard(link, "Link");
  };

  const saveMedia = async () => {
    if (!currentMediaUrl) return;
    setIsLoading(true);
    const blob = await (await fetch(currentMediaUrl)).blob();
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
      {!!currentMediaUrl && (
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
