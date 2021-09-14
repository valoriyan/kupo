import Router from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Close } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { TransitionArea } from "#/components/TransitionArea";
import { styled } from "#/styling";
import { FormStateProvider } from "./FormContext";
import { Initial } from "./Initial";
import { NewPost } from "./NewPost";
import { NewShopItem } from "./NewShopItem";

export enum AddContentScreen {
  Initial = "Initial",
  Post = "Post",
  ShopItem = "ShopItem",
}

const screenToHeading = {
  [AddContentScreen.Initial]: "Add Content",
  [AddContentScreen.Post]: "New Post",
  [AddContentScreen.ShopItem]: "New Shop Item",
};

export const AddContent = () => {
  const [currentScreen, setCurrentScreen] = useState(AddContentScreen.Initial);
  const [additionalScreen, setAdditionalScreen] = useState<ReactNode>(null);

  const lastScreen = useRef<string>();
  useEffect(() => {
    lastScreen.current = additionalScreen ? "additionalScreen" : currentScreen;
  }, [currentScreen, additionalScreen]);

  let bodyNode = <Initial setCurrentScreen={setCurrentScreen} />;
  switch (currentScreen) {
    case AddContentScreen.Initial:
      bodyNode = <Initial setCurrentScreen={setCurrentScreen} />;
      break;
    case AddContentScreen.Post:
      bodyNode = <NewPost setAdditionalScreen={setAdditionalScreen} />;
      break;
    case AddContentScreen.ShopItem:
      bodyNode = <NewShopItem />;
      break;
  }

  return (
    <FormStateProvider>
      <Wrapper>
        <Header>
          {additionalScreen ? (
            <CloseButton onClick={() => setAdditionalScreen(null)}>Done</CloseButton>
          ) : (
            <CloseButton onClick={() => Router.back()}>
              <Close />
            </CloseButton>
          )}
          <Heading>{screenToHeading[currentScreen]}</Heading>
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
          {additionalScreen || bodyNode}
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

const Heading = styled("h1", {
  fontSize: "$4",
  fontWeight: "$bold",
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
