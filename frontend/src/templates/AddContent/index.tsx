import Link from "next/link";
import Router from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { CloseIcon } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { MainTitle } from "#/components/Typography";
import {
  MAX_APP_CONTENT_WIDTH,
  NESTED_PAGE_LAYOUT_HEADER_HEIGHT,
  SIDE_PANEL_WIDTH,
} from "#/constants";
import { styled } from "#/styling";
import { translucentBg } from "#/styling/mixins";
import { assertUnreachable } from "#/utils/assertUnreachable";
import { SessionStorageItem } from "#/utils/storage";
import { FormStateProvider } from "./FormContext";
import { Initial } from "./Initial";
import { NewCommunityPage } from "./NewCommunityPage";
import { NewPost } from "./NewPost";
import { NewShopItem } from "./NewShopItem";

const previousLocation = SessionStorageItem<string>("add-content");

export const setPreviousLocationForAddContent = () => {
  if (Router.asPath === "/add-content") return;
  previousLocation.set(Router.asPath);
};

export enum AddContentScreen {
  Initial = "Initial",
  Post = "Post",
  ShopItem = "Shop Item",
  CommunityPage = "Community Page",
  // PostSchedule = "PostSchedule",
}

const screenToHeading = {
  [AddContentScreen.Initial]: "Add Content",
  [AddContentScreen.Post]: "New Post",
  [AddContentScreen.ShopItem]: "New Shop Item",
  [AddContentScreen.CommunityPage]: "New Community Page",
  // [AddContentScreen.PostSchedule]: "View Post Schedule",
};

export interface AdditionalScreen {
  node: ReactNode;
  heading: string;
}

export interface AddContentProps {
  publishingChannelId: string | undefined;
}

export const AddContent = ({ publishingChannelId }: AddContentProps) => {
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

  let bodyNode = (
    <Initial
      setCurrentScreen={setCurrentScreen}
      publishingChannelId={publishingChannelId}
    />
  );
  switch (currentScreen) {
    case AddContentScreen.Initial:
      bodyNode = (
        <Initial
          setCurrentScreen={setCurrentScreen}
          publishingChannelId={publishingChannelId}
        />
      );
      break;
    case AddContentScreen.Post:
      bodyNode = (
        <NewPost
          setAdditionalScreen={setAdditionalScreen}
          publishingChannelId={publishingChannelId}
        />
      );
      break;
    case AddContentScreen.ShopItem:
      bodyNode = (
        <NewShopItem
          setAdditionalScreen={setAdditionalScreen}
          publishingChannelId={publishingChannelId}
        />
      );
      break;
    case AddContentScreen.CommunityPage:
      bodyNode = <NewCommunityPage />;
      break;
    // case AddContentScreen.PostSchedule:
    //   bodyNode = <PostSchedule calendarState={calendarState} />;
    //   break;
    default:
      assertUnreachable(currentScreen, "Unknown screen received");
  }

  return (
    <FormStateProvider>
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
      <Stack css={{ pt: NESTED_PAGE_LAYOUT_HEADER_HEIGHT }}>
        {additionalScreen?.node || bodyNode}
      </Stack>
    </FormStateProvider>
  );
};

export const Header = styled(Stack, translucentBg, {
  position: "fixed",
  top: 0,
  zIndex: 2,
  px: "$6",
  py: "$5",
  gap: "$1",
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$border",
  width: "100%",
  "@md": {
    width: `calc(100vw - ${SIDE_PANEL_WIDTH})`,
    maxWidth: MAX_APP_CONTENT_WIDTH,
  },
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
