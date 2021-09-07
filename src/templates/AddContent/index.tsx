import Router from "next/router";
import { useState } from "react";
import { Close } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { TransitionArea } from "#/components/TransitionArea";
import { styled } from "#/styling";
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

  let bodyNode = <Initial setCurrentScreen={setCurrentScreen} />;
  switch (currentScreen) {
    case AddContentScreen.Initial:
      bodyNode = <Initial setCurrentScreen={setCurrentScreen} />;
      break;
    case AddContentScreen.Post:
      bodyNode = <NewPost />;
      break;
    case AddContentScreen.ShopItem:
      bodyNode = <NewShopItem />;
      break;
  }

  return (
    <Wrapper>
      <Header>
        <CloseButton onClick={() => Router.back()}>
          <Close />
        </CloseButton>
        <Heading>{screenToHeading[currentScreen]}</Heading>
      </Header>
      <TransitionArea transitionKey={currentScreen} animation={slideInFromRight}>
        {bodyNode}
      </TransitionArea>
    </Wrapper>
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
});

const Heading = styled("h1", {
  fontSize: "$4",
  fontWeight: "$bold",
});

const slideInFromRight = {
  initial: { translateX: "100%" },
  animate: { translateX: 0 },
  exit: { translateX: "-100%" },
};
