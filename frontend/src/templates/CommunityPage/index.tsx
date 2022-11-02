import Router from "next/router";
import Link from "next/link";
import { useGetCommunityByName } from "#/api/queries/community/useGetCommunityByName";
import { useAppLayoutState } from "#/components/AppLayout";
import { ErrorArea, ErrorMessage } from "#/components/ErrorArea";
import { ClipboardIcon, MenuBoxedIcon, ShoppingBagIcon } from "#/components/Icons";
import { ShieldIcon } from "#/components/Icons/generated/ShieldIcon";
import { Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Tabs } from "#/components/Tabs";
import { useCurrentUserId } from "#/contexts/auth";
import { SessionStorage } from "#/utils/storage";
import { CommunityBanner } from "./CommunityBanner";
import { CommunityHeader } from "./CommunityHeader";
import { CommunityPosts } from "./CommunityPosts";
import { CommunityShopItems } from "./CommunityShopItems";
import { Button } from "#/components/Button";
import { getCommunityPageUrl } from "#/utils/generateLinkUrls";
import { CommunityDetails } from "./CommunityDetails";
import { setPreviousLocationForAddContent } from "../AddContent";

const PREVIOUS_LOCATION_BASE_KEY = "previous-location-community-page";

export const setPreviousLocationForCommunityPage = (name: string) => {
  SessionStorage.setItem<string>(PREVIOUS_LOCATION_BASE_KEY + name, Router.asPath);
};

export const goToCommunityPage = (name: string) => {
  setPreviousLocationForCommunityPage(name);
  Router.push(getCommunityPageUrl({ name }));
};

export interface CommunityPageProps {
  name: string;
}

export const CommunityPage = ({ name }: CommunityPageProps) => {
  const { data, isLoading, error } = useGetCommunityByName({ name });
  const clientUserId = useCurrentUserId();
  const scrollPosition = useAppLayoutState((store) => store.scrollPosition);

  const isOwnCommunity = data && clientUserId === data.ownerUserId;
  const isModerator =
    clientUserId &&
    data?.moderators.map((moderator) => moderator.userId).includes(clientUserId);

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
      <Link
        href={{
          pathname: "/add-content",
          query: { publishingChannelId: data.publishingChannelId },
        }}
        passHref
      >
        <Button
          as="a"
          variant="secondary"
          css={{ mx: "$6", my: "$5" }}
          onClick={setPreviousLocationForAddContent}
        >
          Submit Content to Community
        </Button>
      </Link>
      <Tabs
        ariaLabel="Community Content Categories"
        stretchTabs
        tabs={[
          {
            id: "posts",
            trigger: <MenuBoxedIcon />,
            content: <CommunityPosts communityName={data.name} />,
          },
          {
            id: "shopItems",
            trigger: <ShoppingBagIcon />,
            content: <CommunityShopItems communityName={data.name} />,
          },
          {
            id: "communityDetails",
            trigger: <ClipboardIcon />,
            content: <CommunityDetails community={data} />,
          },
          ...(isOwnCommunity || isModerator
            ? [
                {
                  id: "moderation",
                  trigger: <ShieldIcon />,
                  content: <ErrorMessage>Moderation Tools Coming Soon</ErrorMessage>,
                },
              ]
            : []),
        ]}
      />
    </Stack>
  );
};
