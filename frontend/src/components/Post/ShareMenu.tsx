import { useState } from "react";
import {
  MediaElement,
  RootPurchasedShopItemDetails,
  RootRenderablePost,
  RootShopItemPreview,
} from "#/api";
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
  post: RootRenderablePost | RootShopItemPreview | RootPurchasedShopItemDetails;
  currentMediaElement: MediaElement | undefined;
}

export const ShareMenu = ({ hide, post, currentMediaElement }: ShareMenuProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const shareToProfile = () => {
    hide();
    openSharePostModal({ post });
  };

  const copyLink = () => {
    const link = `${location.origin}${getSinglePostUrl(post.id)}`;
    copyTextToClipboard(link, "Link");
  };

  const saveMedia = async () => {
    if (!currentMediaElement) return;
    const { temporaryUrl, mimeType } = currentMediaElement;
    setIsLoading(true);
    const blob = await (await fetch(temporaryUrl, { mode: "no-cors" })).blob();
    const blobUrl = URL.createObjectURL(blob);
    const dlAnchor = document.createElement("a");
    dlAnchor.style.display = "none";
    const fileName = temporaryUrl.split("/").pop();
    const extension = mimeType.split("/").pop();
    dlAnchor.download = `${fileName}.${extension}`;
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
      {!!currentMediaElement && (
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
