import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { assertUnreachable } from "#/utils/assertUnreachable";
import { AdditionalScreen } from "../AddContent";
import { Initial } from "./Initial";
import { styled } from "#/styling";
import { Stack } from "#/components/Layout";
import { FormStateProvider } from "../AddContent/FormContext";
import { TransitionArea } from "#/components/TransitionArea";
import { MainTitle } from "#/components/Typography";
import { CloseIcon } from "#/components/Icons";
import { AccountSettings } from "./AccountSettings";
import { PasswordSettings } from "./AccountSettings/PasswordSettings";
import EditProfilePage from "#/pages/edit-profile";

export enum SettingsScreen {
  Initial = "Initial",
  Profile = "Profile",
  Account = "Account",
  Password = "Password",
}

const screenToHeading = {
  [SettingsScreen.Initial]: "Settings",
  [SettingsScreen.Profile]: "Settings - Profile",
  [SettingsScreen.Account]: "Settings - Account",
  [SettingsScreen.Password]: "Settings - Account - Password",
};

export const Settings = () => {
  const [currentScreen, setCurrentScreen] = useState(SettingsScreen.Initial);
  const [additionalScreen, setAdditionalScreen] = useState<AdditionalScreen | null>(null);

  const lastScreen = useRef<string>();

  useEffect(() => {
    lastScreen.current = additionalScreen ? "additionalScreen" : currentScreen;
  }, [currentScreen, additionalScreen]);

  let bodyNode = <Initial setCurrentScreen={setCurrentScreen} />;

  switch (currentScreen) {
    case SettingsScreen.Initial:
      bodyNode = <Initial setCurrentScreen={setCurrentScreen} />;
      break;
    case SettingsScreen.Profile:
      bodyNode = <EditProfilePage />;
      break;
    case SettingsScreen.Account:
      bodyNode = <AccountSettings setCurrentScreen={setCurrentScreen} />;
      break;
    case SettingsScreen.Password:
      bodyNode = <PasswordSettings />;
      break;
    default:
      assertUnreachable(currentScreen, "Unknown screen received");
  }

  return (
    <FormStateProvider>
      <Wrapper>
        <Header>
          {additionalScreen ? (
            <CloseButton onClick={() => setAdditionalScreen(null)}>Back</CloseButton>
          ) : (
            <CloseButton onClick={() => Router.back()}>
              <CloseIcon />
            </CloseButton>
          )}
          <MainTitle as="h1">
            {additionalScreen ? additionalScreen.heading : screenToHeading[currentScreen]}
          </MainTitle>
        </Header>
        <TransitionArea
          transitionKey={additionalScreen ? "additionalScreen" : currentScreen}
          animation={
            additionalScreen
              ? rightToRight
              : lastScreen.current === "additionalScreen"
              ? leftToLeft
              : rightToLeft
          }
        >
          {additionalScreen?.node || bodyNode}
        </TransitionArea>
      </Wrapper>
    </FormStateProvider>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  height: "100%",
  bg: "$background1",
});

const Header = styled(Stack, {
  px: "$5",
  py: "$4",
  gap: "$4",
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$text",
});

const CloseButton = styled("button", {
  alignSelf: "flex-end",
  fontWeight: "$bold",
  fontSize: "$4",
  height: "$5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const rightToRight = {
  initial: { translateX: "100%" },
  animate: { translateX: 0 },
  exit: { translateX: "100%" },
};

const leftToLeft = {
  initial: { translateX: "-100%" },
  animate: { translateX: 0 },
  exit: { translateX: "-100%" },
};

const rightToLeft = {
  initial: { translateX: "100%" },
  animate: { translateX: 0 },
  exit: { translateX: "-100%" },
};
