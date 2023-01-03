import Link from "next/link";
import { styled } from "#/styling";
import { setPreviousLocationForAddContent } from "#/templates/AddContent";
import { Stack } from "../Layout";
import { ScrollArea } from "../ScrollArea";
import { NavigationItems } from "./NavigationItems";
import { SidePanelWrapper, UploadLink } from "./shared";
import { UserInfo } from "./UserInfo";

export const SidePanel = () => {
  return (
    <SidePanelWrapper>
      <Stack css={{ gap: "$5", px: "$8" }}>
        <UserInfoWrapper>
          <UserInfo />
        </UserInfoWrapper>
        <Link href="/add-content" passHref>
          <UploadLink onClick={setPreviousLocationForAddContent}>Create</UploadLink>
        </Link>
      </Stack>
      <ScrollArea>
        <Stack css={{ gap: "$9", px: "$8", height: "100%" }}>
          <NavigationItems />
        </Stack>
      </ScrollArea>
    </SidePanelWrapper>
  );
};

const UserInfoWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "auto auto",
  alignItems: "start",
  columnGap: "$5",
});
