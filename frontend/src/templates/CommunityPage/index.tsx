import Link from "next/link";
import Router from "next/router";
import { useGetCommunityByName } from "#/api/queries/community/useGetCommunityByName";
import { Button } from "#/components/Button";
import { ErrorArea } from "#/components/ErrorArea";
import { ClipboardIcon, MenuBoxedIcon } from "#/components/Icons";
import { ShieldIcon } from "#/components/Icons/generated/ShieldIcon";
import { Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Tabs } from "#/components/Tabs";
import { useCurrentUserId } from "#/contexts/auth";
import { getCommunityPageUrl } from "#/utils/generateLinkUrls";
import { SessionStorage } from "#/utils/storage";
import { useScrollPosition } from "#/utils/useScrollPosition";
import { setPreviousLocationForAddContent } from "../AddContent";
import { CommunityBanner } from "./CommunityBanner";
import { CommunityDetails } from "./CommunityDetails";
import { CommunityHeader } from "./CommunityHeader";
import { CommunityPosts } from "./CommunityPosts";
import { PendingSubmissions } from "./PendingSubmissions";

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
  const scrollPosition = useScrollPosition();

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
          // TODO: Uncomment to re-enable shop items
          // {
          //   id: "shopItems",
          //   trigger: <ShoppingBagIcon />,
          //   content: <CommunityShopItems communityName={data.name} />,
          // },
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
                  content: (
                    <PendingSubmissions
                      publishingChannelId={data.publishingChannelId}
                      publishingChannelName={data.name}
                      publishingChannelRules={data.publishingChannelRules}
                    />
                  ),
                },
              ]
            : []),
        ]}
      />
    </Stack>
  );
};
