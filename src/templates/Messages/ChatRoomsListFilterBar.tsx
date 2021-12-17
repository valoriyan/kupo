import { Flex } from "#/components/Layout";
import { styled } from "#/styling";

export const ChatRoomsListFilterBar = () => {
  return (
    <FlexWrapper>
      <FriendsListSelected>
        <ListName>All</ListName>
      </FriendsListSelected>

      <FriendsList>Followers</FriendsList>

      <FriendsList>Friends</FriendsList>
    </FlexWrapper>
  );
};

const FlexWrapper = styled(Flex, {
  p: "$3",
  borderBottom: "1px solid $background3",
  justifyContent: "flex-start",
  alignItems: "center",
  width: "100%",
  height: "100%",
  gap: "$3",
});

const FriendsListSelected = styled(Flex, {
  p: "$3",
  borderRadius: "$3",
  borderWidth: "$1",
  borderColor: "$primaryTranslucent",
  backgroundColor: "$primaryTranslucent",
  borderStyle: "solid",

  justifyContent: "center",
  alignContent: "center",
});

const FriendsList = styled("div", {
  textAlign: "center",
  alignContent: "center",
  p: "$3",
  borderRadius: "$3",
  borderWidth: "$1",
  borderColor: "$background3",
  borderStyle: "solid",
});

const ListName = styled("div", {});
