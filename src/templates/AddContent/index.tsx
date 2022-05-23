import Link from "next/link";
import Router from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { CloseIcon } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { TransitionArea } from "#/components/TransitionArea";
import { MainTitle } from "#/components/Typography";
import { styled } from "#/styling";
import { assertUnreachable } from "#/utils/assertUnreachable";
import { SessionStorageItem } from "#/utils/storage";
import { FormStateProvider } from "./FormContext";
import { Initial } from "./Initial";
import { NewPost } from "./NewPost";

const previousLocation = SessionStorageItem<string>("add-content");

export const setPreviousLocationForAddContent = () => {
  if (Router.asPath === "/add-content") return;
  previousLocation.set(Router.asPath);
};

export enum AddContentScreen {
  Initial = "Initial",
  Post = "Post",
  ShopItem = "Shop Item",
  // PostSchedule = "PostSchedule",
}

const screenToHeading = {
  [AddContentScreen.Initial]: "Add Content",
  [AddContentScreen.Post]: "New Post",
  [AddContentScreen.ShopItem]: "New Shop Item",
  // [AddContentScreen.PostSchedule]: "View Post Schedule",
};

export interface AdditionalScreen {
  node: ReactNode;
  heading: string;
}

export const AddContent = () => {
  const [currentScreen, setCurrentScreen] = useState(AddContentScreen.Initial);
  const [additionalScreen, setAdditionalScreen] = useState<AdditionalScreen | null>(null);

  // const calendarState = useCalendarState({
  //   initialSelectedDate: null,
  //   shouldNotSelectDate: true,
  //   onDateSelection: (newDate) => {
  //     setAdditionalScreen({
  //       node: <ScheduleByDay date={newDate} />,
  //       heading: `Post Schedule > ${
  //         SHORT_MONTHS[newDate.getMonth()]
  //       } ${newDate.getDate()}, ${newDate.getFullYear()}`,
  //     });
  //   },
  // });

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
      bodyNode = <NewPost setAdditionalScreen={setAdditionalScreen} />;
      break;
    // case AddContentScreen.PostSchedule:
    //   bodyNode = <PostSchedule calendarState={calendarState} />;
    //   break;
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
            <Link href={previousLocation.get() ?? "/feed"} passHref>
              <CloseButton as="a">
                <CloseIcon />
              </CloseButton>
            </Link>
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
  bg: "$pageBackground",
});

export const Header = styled(Stack, {
  px: "$6",
  py: "$5",
  gap: "$1",
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$text",
});

export const CloseButton = styled("button", {
  color: "$text",
  alignSelf: "flex-end",
  fontWeight: "$bold",
  fontSize: "$4",
  height: "$6",
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
