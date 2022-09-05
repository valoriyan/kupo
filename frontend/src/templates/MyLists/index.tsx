import Link from "next/link";
import { ProfilePrivacySetting } from "#/api";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { Chip } from "#/components/Chip";
import { Stack } from "#/components/Layout";
import { Spinner } from "#/components/Spinner";
import { mainTitleStyles } from "#/components/Typography";
import { styled } from "#/styling";

export const MyLists = () => {
  const { data, isLoading } = useGetClientUserProfile();

  const followingCount = data?.follows.count ?? "?";
  const followersCount = data?.followers.count ?? "?";
  const followerRequests = data?.followerRequests.count ?? "?";

  return (
    <Stack css={{ size: "100%" }}>
      <Link href="/my-lists/following" passHref>
        <ListButton>
          Following
          {isLoading ? <Spinner size="md" /> : <Chip>{followingCount}</Chip>}
        </ListButton>
      </Link>
      <Link href="/my-lists/followers" passHref>
        <ListButton>
          Followers
          {isLoading ? <Spinner size="sm" /> : <Chip>{followersCount}</Chip>}
        </ListButton>
      </Link>
      {(data?.profilePrivacySetting === ProfilePrivacySetting.Private ||
        !!data?.followerRequests?.count) && (
        <Link href="/my-lists/follower-requests" passHref>
          <ListButton>
            Follower Requests
            {isLoading ? <Spinner size="sm" /> : <Chip>{followerRequests}</Chip>}
          </ListButton>
        </Link>
      )}
    </Stack>
  );
};

const ListButton = styled("a", mainTitleStyles, {
  display: "flex",
  alignItems: "center",
  gap: "$6",
  px: "$9",
  py: "$7",
  color: "$text",
  fontSize: "$3",
  fontWeight: "$bold",
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$border",
});
