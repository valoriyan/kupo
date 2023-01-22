import { styled } from "#/styling";
import { Stack } from "../Layout";
import { ScrollArea } from "../ScrollArea";
import { VerifyEmailState } from "../VerifyEmailModal";
import { NavigationItems } from "./NavigationItems";
import { SidePanelWrapper, UploadButton } from "./shared";
import { UserInfo } from "./UserInfo";

export interface SidePanelProps {
  verifyEmailState: VerifyEmailState;
}

export const SidePanel = ({ verifyEmailState }: SidePanelProps) => {
  return (
    <SidePanelWrapper>
      <Stack css={{ gap: "$5", px: "$8" }}>
        <UserInfoWrapper>
          <UserInfo />
        </UserInfoWrapper>
        <UploadButton verifyEmailState={verifyEmailState}>Create</UploadButton>
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
