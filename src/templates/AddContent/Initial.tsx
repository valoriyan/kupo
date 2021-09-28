import { Calendar, Duplicate, Tag } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { mainTitleStyles } from "#/components/Typography";
import { styled } from "#/styling";
import { AddContentScreen } from ".";

export interface InitialProps {
  setCurrentScreen: (newScreen: AddContentScreen) => void;
}

export const Initial = (props: InitialProps) => {
  return (
    <Stack>
      <NewItemButton onClick={() => props.setCurrentScreen(AddContentScreen.Post)}>
        <Duplicate /> New Post
      </NewItemButton>
      <NewItemButton onClick={() => props.setCurrentScreen(AddContentScreen.ShopItem)}>
        <Tag /> New Shop Item
      </NewItemButton>
      <NewItemButton
        onClick={() => props.setCurrentScreen(AddContentScreen.PostSchedule)}
      >
        <Calendar /> View Post Schedule
      </NewItemButton>
    </Stack>
  );
};

const NewItemButton = styled("button", mainTitleStyles, {
  display: "flex",
  alignItems: "center",
  gap: "$5",
  px: "$8",
  py: "$6",
  fontSize: "$3",
  fontWeight: "$bold",
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$border",
});
