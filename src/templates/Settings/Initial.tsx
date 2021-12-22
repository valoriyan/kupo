import { DuplicateIcon, TagIcon } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { mainTitleStyles } from "#/components/Typography";
import { styled } from "#/styling";
import { SettingsScreen } from ".";

export interface InitialProps {
  setCurrentScreen: (newScreen: SettingsScreen) => void;
}

export const Initial = (props: InitialProps) => {
  return (
    <Stack>
      <NewItemButton onClick={() => props.setCurrentScreen(SettingsScreen.Profile)}>
        <DuplicateIcon /> Profile
      </NewItemButton>
      <NewItemButton onClick={() => props.setCurrentScreen(SettingsScreen.Account)}>
        <TagIcon /> Account
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
