import { CommunityIcon, DuplicateIcon, TagIcon } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { mainTitleStyles } from "#/components/Typography";
import { styled } from "#/styling";
import { AddContentScreen } from ".";

export interface InitialProps {
  setCurrentScreen: (newScreen: AddContentScreen) => void;
  publishingChannelId: string | undefined;
}

export const Initial = (props: InitialProps) => {
  return (
    <Stack>
      <NewItemButton onClick={() => props.setCurrentScreen(AddContentScreen.Post)}>
        <DuplicateIcon /> New Post
      </NewItemButton>
      <NewItemButton onClick={() => props.setCurrentScreen(AddContentScreen.ShopItem)}>
        <TagIcon /> New Shop Item
      </NewItemButton>
      {!props.publishingChannelId && (
        <NewItemButton
          onClick={() => props.setCurrentScreen(AddContentScreen.CommunityPage)}
        >
          <CommunityIcon /> New Community Page
        </NewItemButton>
      )}
      {/* <NewItemButton
        onClick={() => props.setCurrentScreen(AddContentScreen.PostSchedule)}
      >
        <CalendarIcon /> View Post Schedule
      </NewItemButton> */}
    </Stack>
  );
};

const NewItemButton = styled("button", mainTitleStyles, {
  display: "flex",
  alignItems: "center",
  gap: "$6",
  px: "$9",
  py: "$7",
  fontSize: "$3",
  fontWeight: "$bold",
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$border",
});
