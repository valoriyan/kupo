import { useSharePost } from "#/api/mutations/posts/sharePost";
import { styled } from "#/styling";
import { CloseIcon, UserIcon } from "../Icons";
import { Stack } from "../Layout";
import { Heading } from "../Typography";

export interface ShareMenuProps {
  hide: () => void;
  postId: string;
}

export const ShareMenu = ({ hide, postId }: ShareMenuProps) => {
  const { mutateAsync: sharePost } = useSharePost({ postId });

  const shareToProfile = async () => {
    sharePost({
      caption: "I want to share this!",
      hashtags: ["shared"],
    });
    hide();
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
