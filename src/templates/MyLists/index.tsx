import Link from "next/link";
import { Stack } from "#/components/Layout";
import { mainTitleStyles } from "#/components/Typography";
import { styled } from "#/styling";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { Spinner } from "#/components/Spinner";
import { Chip } from "#/components/Chip";

export const MyLists = () => {
  const { data, isLoading } = useGetClientUserProfile();

  const followingCount = data?.follows.count ?? "?";
  const followersCount = data?.followers.count ?? "?";

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
