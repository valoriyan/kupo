import { styled } from "#/styling";
import { CloseIcon } from "../Icons";
import { Flex, Stack } from "../Layout";
import { ScrollArea } from "../ScrollArea";
import { NavigationItems } from "./NavigationItems";
import { UserInfo } from "./UserInfo";

export interface NavigationDrawerProps {
  hide: () => void;
}

export const NavigationDrawer = ({ hide }: NavigationDrawerProps) => {
  return (
    <Wrapper>
      <UserInfoWrapper>
        <UserInfo onUsernameClick={hide} />
        <Flex as="button" onClick={hide}>
          <CloseIcon />
        </Flex>
      </UserInfoWrapper>
      <ScrollArea>
        <Stack css={{ gap: "$9", px: "$8", pt: "$8", height: "100%" }}>
          <NavigationItems onItemClick={hide} />
        </Stack>
      </ScrollArea>
    </Wrapper>
  );
};

const Wrapper = styled(Stack, {
  bg: "$background1",
  height: "100%",
});

const UserInfoWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "auto auto auto",
  alignItems: "start",
  columnGap: "$5",
  p: "$5",
  borderBottomStyle: "solid",
  borderBottomColor: "$border",
  borderBottomWidth: "1px",
  "> *:first-child": { alignSelf: "center" },
});
