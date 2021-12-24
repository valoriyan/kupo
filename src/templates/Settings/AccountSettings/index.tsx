import { ChangeEvent, MouseEvent, useState } from "react";

import { useGetUserProfile } from "#/api/queries/users/useGetUserProfile";
import { Api } from "#/api";
import { SettingsScreen } from "..";
import { styled } from "#/styling";
import { mainTitleStyles } from "#/components/Typography";
import { DuplicateIcon } from "#/components/Icons";

export interface InitialProps {
  setCurrentScreen: (newScreen: SettingsScreen) => void;
}

export const AccountSettings = (props: InitialProps) => {
  const [updatedEmail, setUpdatedEmail] = useState<string>("");

  const { data, isLoading, error } = useGetUserProfile({ isOwnProfile: true });

  const [hasLoaded, updatedHasLoaded] = useState<boolean>(false);

  if (error && !isLoading) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const { email } = data;

  if (!hasLoaded) {
    updatedHasLoaded(true);
    setUpdatedEmail(email || "");
  }

  function onChangUserEmail(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const newValue = event.currentTarget.value;
    setUpdatedEmail(newValue);
  }

  function onSubmitSettings(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    Api.updateUserProfile({
      userEmail: updatedEmail,
    });
  }

  return (
    <div>
      <div>
        Email:
        <input type="text" value={updatedEmail} onChange={onChangUserEmail} />
      </div>

      <br />
      <button onClick={onSubmitSettings}>Save Settings</button>

      <div>
        <NewItemButton onClick={() => props.setCurrentScreen(SettingsScreen.Password)}>
          <DuplicateIcon /> Password
        </NewItemButton>
      </div>
    </div>
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
