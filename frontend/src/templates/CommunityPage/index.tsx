import Router from "next/router";
import { useGetCommunityByName } from "#/api/queries/community/useGetCommunityByName";
import { useAppLayoutState } from "#/components/AppLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { MenuBoxedIcon, ShoppingBagIcon } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Tabs } from "#/components/Tabs";
import { useCurrentUserId } from "#/contexts/auth";
import { SessionStorage } from "#/utils/storage";
import { CommunityBanner } from "./CommunityBanner";
import { CommunityHeader } from "./CommunityHeader";

const PREVIOUS_LOCATION_BASE_KEY = "previous-location-community-page";

export const setPreviousLocationForCommunityPage = (name: string) => {
  SessionStorage.setItem<string>(PREVIOUS_LOCATION_BASE_KEY + name, Router.asPath);
};

export interface CommunityPageProps {
  name: string;
}

export const CommunityPage = ({ name }: CommunityPageProps) => {
  const { data, isLoading, error } = useGetCommunityByName({ name });
  const clientUserId = useCurrentUserId();
  const scrollPosition = useAppLayoutState((store) => store.scrollPosition);

  const isOwnCommunity = data && clientUserId === data.ownerUserId;

  const backRoute = SessionStorage.getItem<string>(PREVIOUS_LOCATION_BASE_KEY + name);

  return !isLoading && error ? (
    <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
  ) : isLoading || !data ? (
    <LoadingArea size="lg" />
  ) : (
    <Stack>
      <CommunityBanner
        isOwnCommunity={isOwnCommunity}
        scrollPosition={scrollPosition}
        backRoute={backRoute}
        community={data}
      />
      <CommunityHeader isOwnCommunity={isOwnCommunity} community={data} />
      <Tabs
        ariaLabel="Community Content Categories"
        stretchTabs
        tabs={[
          {
            id: "posts",
            trigger: <MenuBoxedIcon />,
            content: null,
          },
          {
            id: "shopItems",
            trigger: <ShoppingBagIcon />,
            content: null,
          },
        ]}
      />
    </Stack>
  );
};
