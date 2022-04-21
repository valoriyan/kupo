import Link from "next/link";
import { styled } from "#/styling";
import { getProfilePageUrl } from "#/utils/generateLinkUrls";
import { Body } from "../Typography";

export interface UserNameProps {
  username?: string;
  onClick?: () => void;
}

export const UserName = ({ username, onClick }: UserNameProps) => {
  return (
    <Link href={username ? getProfilePageUrl({ username }) : ""} passHref>
      <Name as="a" onClick={onClick}>
        @{username || "User"}
      </Name>
    </Link>
  );
};

const Name = styled(Body, { fontWeight: "$bold" });
