import Router from "next/router";
import { useGetUserByUsername } from "#/api/queries/users/useGetUserByUsername";
import { useAppLayoutState } from "#/components/AppLayout";
import { ErrorArea } from "#/components/ErrorArea";
import { MenuBoxedIcon } from "#/components/Icons/generated/MenuBoxedIcon";
import { ShoppingBagIcon } from "#/components/Icons/generated/ShoppingBagIcon";
import { Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Tabs } from "#/components/Tabs";
import { useCurrentUserId } from "#/contexts/auth";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { SessionStorage } from "#/utils/storage";
import { ProfileBanner } from "./ProfileBanner";
import { ProfileHeader } from "./ProfileHeader";
import { UserPosts } from "./UserPosts";

const PREVIOUS_LOCATION_BASE_KEY = "previous-location-user-profile";

export const setPreviousLocationForUserProfilePage = (username: string) => {
  SessionStorage.setItem<string>(PREVIOUS_LOCATION_BASE_KEY + username, Router.asPath);
};

export const goToUserProfilePage = (username: string) => {
  setPreviousLocationForUserProfilePage(username);
  Router.push(getProfilePageUrl({ username }));
};

export const UserProfile = ({ username }: { username: string }) => {
  const { data, isLoading, error } = useGetUserByUsername({ username });
  const clientUserId = useCurrentUserId();
  const scrollPosition = useAppLayoutState((store) => store.scrollPosition);

  const isOwnProfile = data && clientUserId === data?.userId;

  const backRoute = SessionStorage.getItem<string>(
    PREVIOUS_LOCATION_BASE_KEY + data?.username,
  );

  return !isLoading && error ? (
    <ErrorArea>{error.message || "An error occurred"}</ErrorArea>
  ) : isLoading || !data ? (
    <LoadingArea size="lg" />
  ) : (
    <Stack>
      <ProfileBanner
        isOwnProfile={isOwnProfile}
        user={data}
        scrollPosition={scrollPosition}
        backRoute={backRoute}
      />
      <ProfileHeader isOwnProfile={isOwnProfile} user={data} />
      <Tabs
        ariaLabel="User Content Categories"
        stretchTabs
        tabs={[
          {
            id: "posts",
            trigger: <MenuBoxedIcon />,
            content: <UserPosts user={data} />,
          },
          {
            id: "shopItems",
            trigger: <ShoppingBagIcon />,
            content: <UserPosts user={data} />,
          },
        ]}
      />
    </Stack>
  );
};
