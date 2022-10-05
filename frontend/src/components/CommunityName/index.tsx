import Link from "next/link";
import { styled } from "#/styling";
import { setPreviousLocationForCommunityPage } from "#/templates/CommunityPage";
import { getCommunityPageUrl } from "#/utils/generateLinkUrls";
import { Body } from "../Typography";

export interface CommunityNameProps {
  name?: string;
  onClick?: () => void;
}

export const CommunityName = ({ name, onClick }: CommunityNameProps) => {
  return (
    <Link href={name ? getCommunityPageUrl({ name }) : ""} passHref>
      <Name
        as="a"
        onClick={() => {
          if (name) setPreviousLocationForCommunityPage(name);
          onClick?.();
        }}
      >
        +{name || "Community"}
      </Name>
    </Link>
  );
};

const Name = styled(Body, { fontWeight: "$bold" });
