import Link from "next/link";
import { styled } from "#/styling";
import {
  goToUserProfilePage,
  setPreviousLocationForUserProfilePage,
} from "#/templates/UserProfile";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { Body } from "../Typography";
import { Flex } from "../Layout";
import { Avatar } from "../Avatar";

export interface UserNameProps {
  username?: string;
  onClick?: () => void;
  avatarUrl?: string;
}

export const UserName = ({ username, onClick, avatarUrl }: UserNameProps) => {
  const userNameNode = (
    <Link href={username ? getProfilePageUrl({ username }) : ""} passHref>
      <Name
        as="a"
        onClick={() => {
          if (username) setPreviousLocationForUserProfilePage(username);
          onClick?.();
        }}
      >
        @{username || "User"}
      </Name>
    </Link>
  );

  if (avatarUrl) {
    return (
      <Flex css={{ gap: "$4", alignItems: "center" }}>
        <Avatar
          size="$7"
          src={avatarUrl}
          alt={`@${username}'s profile picture`}
          onClick={() => {
            if (username) goToUserProfilePage(username);
            onClick?.();
          }}
        />
        {userNameNode}
      </Flex>
    );
  }

  return userNameNode;
};

const Name = styled(Body, { fontWeight: "$bold" });
